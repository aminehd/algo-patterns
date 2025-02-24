from poc_debug_viz import ColorPdb
import heapq
from typing import List

pdb = ColorPdb()



# pdb.set_trace() ### use this instead of Break point

# PLEAS Make a simple function like do_anim that pdb.loggersout sourcecode, https://claude.ai/chat/7bd24041-1440-4b66-9e95-d2cd38126dd4
#   Necassary parts of this working: using pdb.set_break(__file__, i) so clicking c works ,pdb.set_trace() so it gets to debugger mode
#   In format_stack_entry pdb.logger only the code of interest (from def fnmae to end of fn that can be marked by myself)
#   In do_c pdb.logger the messages only after the code frame, and in the same file as the code frame pdb.loggered

def print_state(nums, left, right, message, **kwargs):
    """
    Print the current state of the sliding window with emoji pointers
    aligned below the elements.
    

    Args:
        nums: The binary array
        left: Left pointer position
        right: Right pointer position
        **kwargs: Additional state variables to display
    """

    pdb.clean_logger()
    # Create a copy of the array as strings for display
    display = [str(num) for num in nums]
    
    pdb.logger(message)
    # Print the array elements
    pdb.logger(' '.join(display))
    # Create pointer display line
    pointers = [' ' for _ in range(len(nums))]
    if 0 <= left < len(nums):
        
        
        pointers[left] = '👆'
    if 0 <= right < len(nums):
        pointers[right] = '👆'
    
    # Print the pointers line
    pdb.logger(' '.join(pointers))
    
    # Print additional state variables
    state_info = []
    for key, value in kwargs.items():
        state_info.append(f"{key}: {value}")
    
    if state_info:
        pdb.logger(', '.join(state_info))

    pdb.logger('\n')

for i in range(61, 87):
    pdb.set_break(__file__, i)
#     Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.
class Solution:
    
    
    def longestOnes(self, nums: List[int], k: int) -> int:
        pdb.set_trace(start_line=61, end_line=86)
        left = 0
        max_length = 0
        zero_count = 0
        
        for right in range(len(nums)):
            if nums[right] == 0:
                zero_count += 1
            
            print_state(nums, left, right, zero_count=zero_count, k=k, max_length=max_length, message="Started expanding window")
            while zero_count > k:
                if nums[left] == 0:
                    zero_count -= 1
                left += 1
                print_state(nums, left, right, zero_count=zero_count, k=k, max_length=max_length, message="Shrinking window")
            
            # Update maximum length
            current_length = right - left + 1
            max_length = max(max_length, current_length)
            
        return max_length



sol = Solution()
pdb.logger(sol.longestOnes([1,1,1,0,0,0,1,1,1,1,0], 2))




class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        pdb.logger("┌─────────────────────────────────────────────────────")
        pdb.logger("│ 📊 Input array: " +  str(nums))
        pdb.logger("│ 🔄 Allowed flips (k):" + str(k) )
        pdb.logger("└─────────────────────────────────────────────────────")
        # Draw the input array as a tree-like structure
        pdb.logger("    " + " ".join([str(n) for n in nums]))
        pdb.logger("    " + " ".join([f"↓" for _ in nums]))
        indices = "    " + " ".join([str(i) for i in range(len(nums))])
        pdb.logger(indices)
        pdb.logger("\n")
        left = 0
        max_seen = 0
        
        pdb.set_trace(context=20)
        for right in range(len(nums)):
            # Decrease k when we encounter a 0
            if nums[right] == 0:
                k -= 1
            pdb.clean_logger()
            pdb.logger(f"┌────────────────────────────────────────────────")
            pdb.logger(f"│ 🔄 ITERATION #{right+1}")
            pdb.logger(f"│ 👉 Window: {nums[left:right+1]}")
            pdb.logger(f"│ 📍 Left: {left}, Right: {right}")
            pdb.logger(f"│ 📏 Current window size: {right - left + 1}")
            pdb.logger(f"│ 🏆 Max window so far: {max_seen}")
            
            # Shrink window from left when we have used too many flips
            if k < 0:
                pdb.logger(f"│ ⚠️ Too many zeros! Need to shrink window")
                pdb.logger(f"│ 🔍 Entering while loop to adjust left pointer")
                
                pdb.logger(f"│ ┌────────────────────────────────────────")
                level = 0
                
                while left <= right and k < 0:
                    pdb.logger(f"│ │ {'  ' * level}┌────────────────────────────")
                    
                    # If we remove a 0 from window, we get a flip back
                    if nums[left] == 0:
                        k += 1
                        pdb.logger(f"│ │ {'  ' * level}│ 🔄 Removed a zero, k: {k-1} → {k}")
                    else:
                        pdb.logger(f"│ │ {'  ' * level}│ ⏩ Removed a one, k unchanged: {k}")
                        
                    left += 1
                    pdb.logger(f"│ │ {'  ' * level}│ 👈 Move left: {left-1} → {left}")
                    pdb.logger(f"│ │ {'  ' * level}│ 🔲 New window: {nums[left:right+1]}")
                    pdb.logger(f"│ │ {'  ' * level}└────────────────────────────")
                    level += 1
                    
                pdb.logger(f"│ └────────────────────────────────────────")
                pdb.logger(f"│ 🔍 Exited while loop, window is now valid")
            else:
                pdb.logger(f"│ ✅ Window is valid (k ≥ 0)")
                
            # Update the maximum valid window seen so far
            max_seen = max(max_seen, right - left + 1)
            pdb.logger(f"│ 📊 AFTER PROCESSING: Window {nums[left:right+1]}")
            pdb.logger(f"│ 📍 Left: {left}, Right: {right}, k: {k}")
            pdb.logger(f"│ 🏆 Max window updated: {max_seen}")
            pdb.logger(f"└────────────────────────────────────────────────\n")
            
        # Final result
        pdb.logger("┌─────────────────────────────────────────────────────")
        pdb.logger(f"│ 🎯 FINAL RESULT: {max_seen}")
        pdb.logger("└─────────────────────────────────────────────────────")
        
        return max_seen
    
        
sol = Solution()
pdb.logger(sol.longestOnes([1,1,1,0,0,0,1,1,1,1,0], 2))