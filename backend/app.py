"""
Algorithm debugger API server that executes functions and returns debug frames
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Tuple
import uvicorn

# Import the debugging components from the prodebug module
from prodebug import DebugExecutor, DebugFrame

# Create FastAPI app
app = FastAPI(
    title="Algorithm Debugger API",
    description="API for debugging and visualizing algorithms",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define response models
class DebugFrameResponse(BaseModel):
    func_name: str
    current_line: int
    source_lines: List[str]
    start_line: int
    variables: Dict[str, str]
    return_value: Optional[Any] = None
    exception: Optional[Tuple[str, str]] = None

class DebugResponse(BaseModel):
    function_name: str
    source_lines: List[str]
    start_line: int
    source_file: str
    args: List[Any]
    kwargs: Dict[str, Any]
    return_value: Optional[Any] = None
    exception: Optional[Tuple[str, str]] = None
    debug_frames: List[Dict[str, Any]]

# Example algorithm functions to debug
def binary_search(arr, target):
    """Binary search algorithm to find a target in a sorted array"""
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

def two_sum(nums, target):
    """Find two numbers in array that add up to target"""
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return [-1, -1]

# Create debug executor
executor = DebugExecutor()

@app.get("/")
def read_root():
    return {"message": "Algorithm Debugger API is running"}

@app.get("/debug/binary-search", response_model=DebugResponse)
def debug_binary_search(target: int = 42):
    """Debug a binary search algorithm with visualization data"""
    # Create a sorted array for binary search
    arr = list(range(0, 100, 2))  # [0, 2, 4, ..., 98]
    
    # Run the debugger on binary search
    _, debug_info = executor.execute(binary_search, arr, target)
    
    # Convert debug frames to dict for JSON serialization
    frames = []
    for frame in debug_info["debug_frames"]:
        frames.append({
            "func_name": frame.func_name,
            "current_line": frame.current_line,
            "source_lines": frame.source_lines,
            "start_line": frame.start_line,
            "variables": frame.variables,
            "return_value": frame.return_value,
            "exception": frame.exception
        })
    
    # Update debug_info with serializable frames
    debug_info["debug_frames"] = frames
    
    return debug_info

@app.get("/debug/two-sum", response_model=DebugResponse)
def debug_two_sum(target: int = 10):
    """Debug a two sum algorithm with visualization data"""
    # Create an array for two sum
    nums = [2, 7, 11, 15, 3, 6, 8, 1]
    
    # Run the debugger on two sum
    _, debug_info = executor.execute(two_sum, nums, target)
    
    # Convert debug frames to dict for JSON serialization
    frames = []
    for frame in debug_info["debug_frames"]:
        frames.append({
            "func_name": frame.func_name,
            "current_line": frame.current_line,
            "source_lines": frame.source_lines,
            "start_line": frame.start_line,
            "variables": frame.variables,
            "return_value": frame.return_value,
            "exception": frame.exception
        })
    
    # Update debug_info with serializable frames
    debug_info["debug_frames"] = frames
    
    return debug_info

if __name__ == "__main__":
    # Run the server
    uvicorn.run("app:app", host="0.0.0.0", port=83, reload=True)

# To run the server:
# cd PolyPortfolio/algo-patterns/backend
# poetry install
# python app.py
#
# Access at: http://localhost:83/debug/binary-search or http://localhost:83/debug/two-sum 