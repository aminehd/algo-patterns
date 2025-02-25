from poc_debug_viz import ColorPdb
import heapq
from typing import List
from collections import deque

pdb = ColorPdb()



# pdb.set_trace() ### use this instead of Break point

# PLEAS Make a simple function like do_anim that pdb.loggersout sourcecode, https://claude.ai/chat/7bd24041-1440-4b66-9e95-d2cd38126dd4
#   Necassary parts of this working: using pdb.set_break(__file__, i) so clicking c works ,pdb.set_trace() so it gets to debugger mode
#   In format_stack_entry pdb.logger only the code of interest (from def fnmae to end of fn that can be marked by myself)
#   In do_c pdb.logger the messages only after the code frame, and in the same file as the code frame pdb.loggered

def print_state(nums, left, right, message, **kwargs):
    pass

for i in range(23, 47):
    pdb.set_break(__file__, i)
#     Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.
class Solution:
     def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        pdb.set_trace(start_line=23, end_line=46)
        i = 0
        monoth_window = deque([]) 
 
        res = []
        for j in range(len(nums)):
            # we build a monothonic window 
            # we wanna add j. we dequeue so much so it is a 
            while len(monoth_window) and nums[monoth_window[-1]] < nums[j]:
                monoth_window.pop()
            monoth_window.append(j)
            
            
            # Once window complete from right , pop left            
            if j - i == k :
                # 
                largest_index = monoth_window[0]
                res.append(nums[largest_index])
                if (largest_index == i):
                    monoth_window.popleft()
                i += 1
        return res
    
    
sol = Solution()
print(sol.maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3))  #  print [3,3,5,5,6,7]
    
# block comment
"""
# 239. Sliding Window Maximum | https://leetcode.com/problems/sliding-window-maximum | ['Array', 'Queue', 'Sliding Window', 'Heap (Priority Queue)', '1+'] |
Sometimes the tick is to use some similar version of sliding 
window but you dont want keep the whole window, just the monothonic
To keep things O(1) you need this trick:
MONOTHONIC DEQUEUE.🎯 Key Interview Insights for Sliding Window Maximum: 1)
🧠 The "aha moment" is realizing that smaller elements before a larger element can never be the maximum - this leads to the monotonic deque approach 2) 📊 Using indices instead of values in the deque is cleaner because it helps us track window boundaries without extra logic 3) 🏗️ The solution structure follows a classic sliding window pattern: process element, maintain data structure, check window size, collect result 4) 💡 Interviewers expect you to recognize that a heap isn't optimal here due to removal complexity - showing this understanding is a plus 5) 🔄 The monotonic property (keeping elements in decreasing order) is what makes this solution O(n) instead of O(nk) 6) 👨‍💻 Clean code aspects they look for: clear variable names (window, right), logical steps (remove smaller elements, append, check window, collect result) 7) 🎤 Communication points that impress: explaining why we don't need smaller elements, walking through an example, mentioning the time complexity improvement 8) 🎯 Pattern recognition: similar to problems like "Next Greater Element" where monotonic structures help 9) 🧪 Edge cases they expect you to handle: window size equals array length, window size of 1, empty array 10) 🚀 Optimization understanding: why deque is better than other data structures (O(1) operations at both ends, natural fit for sliding window).**Great_Example_Print**, **Greate_Writing_Idea**, **Monotholic**
"""

[] work with claude proj to get state representation
[] /Users/aminehdadsetan/WorkSpace/algo-patterns/external_debug_log.md
[] make a gif, 
[] write to substac
