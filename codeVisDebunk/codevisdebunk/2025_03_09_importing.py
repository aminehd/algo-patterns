#!/usr/bin/env python
# codeVisDebunk/codevisdebunk/run_viz.py

from codevisdebunk.poc_debug_viz import ColorPdb
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
    Print the current state of the two pointers with enhanced ASCII art visualization.
    """
    pdb.clean_logger()

    # Create top border with message
    pdb.logger("┌───────────────────────────────────────────────────┐")
    pdb.logger(f"│ {message}")
    pdb.logger("│")

    # Print input array with indices for reference
    index_str = "│ Indices: "
    for i in range(len(nums)):
        index_str += f"{i:^2} "
    pdb.logger(index_str)
    
    # Print the original input array
    input_str = "│ Input:   "
    for num in nums:
        input_str += f"{num:^2} "
    pdb.logger(input_str)
    pdb.logger("│")

    # Print current array state with visual indicators
    pdb.logger("│ Current Array State:")
    array_str = "│ " + 8 * " "
    for i, num in enumerate(nums):
        if i == left and i == right:
            array_str += f"[{num}]"
        elif i == left:
            array_str += f"[{num} "
        elif i == right:
            array_str += f" {num}]"
        elif i > left and i < right:
            array_str += f" {num} "
        else:
            array_str += f" {num} "
    array_str += " │"
    pdb.logger(array_str)

    # Print pointer movement visualization
    pdb.logger("│")
    pdb.logger("│ Pointer Positions:")
    pointer_str = "│ " + 8 * " "
    for i in range(len(nums)):
        if i == left and i == right:
            pointer_str += "L R"
        elif i == left:
            pointer_str += "L  "
        elif i == right:
            pointer_str += "  R"
        else:
            pointer_str += "   "
    pdb.logger(pointer_str)

    # Print pointer values
    pdb.logger("│")
    pdb.logger(f"│ Left pointer (L) at index {left}, value: {nums[left]}")
    pdb.logger(f"│ Right pointer (R) at index {right}, value: {nums[right]}")

    # Print state variables
    if kwargs:
        pdb.logger("│")
        pdb.logger("│ Additional State Information:")
        for k, v in kwargs.items():
            pdb.logger(f"│ {k} = {v}")

    # Print bottom border    
    pdb.logger("└───────────────────────────────────────────────────┘")
    pdb.logger("")

            
        


for i in range(98, 111):
    pdb.set_break(__file__, i)
#     Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        pdb.set_trace(start_line=98, end_line=111)
        l, r = 0, 0
        for r in range(len(nums)):
            print_state(nums, l, r, message="Started expanding window")
            if nums[r] != nums[l]:
                l += 1
                nums[l] = nums[r]
        end = l + 1
        while end < len(nums):
            nums[end] = '_'
            end += 1
        return l + 1


# to get it running dont forgot the         pdb.set_trace(start_line=92, end_line=104) , and cd  codeVisDebunk and run `poetry run algo-viz`
sol = Solution()
sol.removeDuplicates([1,1,2,2,3,3,4,4,5,5])




