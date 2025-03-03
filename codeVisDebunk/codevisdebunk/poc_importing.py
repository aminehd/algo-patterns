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
    Print the current state of the two pointers with ASCII art visualization.
    """
    pdb.clean_logger()

    # Create top border with message
    pdb.logger("┌───────────────────────────────────────────────────┐")
    pdb.logger(f"│ {message}")

    # Print array with visual indicators
    array_str = "│ "
    for i, num in enumerate(nums):
        if i == left and i == right:
            array_str += f"[{num}]"
        elif i == left:
            array_str += f"🚪{num}"
        elif i == right:
            array_str += f"{num}🚪"
        elif i > left and i < right:
            array_str += f" {num} "
        else:
            array_str += f" {num} "
    array_str += " "
    pdb.logger(array_str)

    # Print pointer indicators and search space
    pointer_str = "│ "
    for i in range(len(nums)):
        num_width = len(str(nums[i]))
        if i == left and i == right:
            pointer_str += " ↕ " + " " * (num_width - 1)
        elif i == left:
            pointer_str += "🚪↑ " + " " * (num_width - 1)
        elif i == right:
            pointer_str += "↑🚪" + " " * (num_width - 1)
        elif i > left and i < right:
            pointer_str += " · " + " " * (num_width - 1)  # Show search space
        else:
            pointer_str += "   " + " " * (num_width - 1)
    pointer_str += " "
    pdb.logger(pointer_str)

    # Print current sum visualization
    if left != right:
        sum_str = "│ "
        curr_sum = nums[left] + nums[right]
        sum_str += f"{nums[left]} + {nums[right]} = {curr_sum}"
        if "target" in kwargs:
            target = kwargs["target"]
            if curr_sum < target:
                sum_str += f" (too small, need {target-curr_sum} more)"
            elif curr_sum > target:
                sum_str += f" (too large, need {curr_sum-target} less)"
        sum_str += " " * (len(nums) * 4 - len(sum_str) + 1) + "│"
        pdb.logger(sum_str)

    # Print state variables
    if kwargs:
        state_str = "│ "
        state_items = [f"{k}={v}" for k,v in kwargs.items()]
        state_str += ", ".join(state_items)
        state_str += " " * (len(nums) * 4 + 3 - len(state_str) + 1) + "│"
        pdb.logger(state_str)

    # Print bottom border    
    pdb.logger("└───────────────────────────────────────────────────┘")
    pdb.logger("")


for i in range(92, 104):
    pdb.set_break(__file__, i)
#     Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.
class Solution:
    def twoSum(self, nums, target):
        pdb.set_trace(start_line=92, end_line=104)
        nums.sort()
        l, r = 0, len(nums) - 1
        while l < r:
            print_state(nums, l, r, target=target, message="Inward traversal")
            if nums[l] + nums[r] == target:
                return [l, r]
            elif nums[l] + nums[r] < target:
                l += 1
            else:
                r -= 1
        return []


# to get it running dont forgot the         pdb.set_trace(start_line=92, end_line=104) , and cd  codeVisDebunk and run `poetry run algo-viz`
sol = Solution()
nums = [1, 4, 6, 8, 9, 11, 15, 17, 20, 25, 30, 50]
target = 23
pdb.logger(sol.twoSum(nums, target))
# create a good example with lots of l and r changeing






