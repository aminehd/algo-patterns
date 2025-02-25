```python
      24      def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
      25         pdb.set_trace(start_line=23, end_line=46)
      26         i = 0
      27         monoth_window = deque([])
      28
      29         res = []
      30         for j in range(len(nums)):
      31             # we build a monothonic window
      32             # we wanna add j. we dequeue so much so it is a
      33             while len(monoth_window) and nums[monoth_window[-1]] < nums[j]:
      34                 monoth_window.pop()
      35             monoth_window.append(j)
      36
      37
      38             # Once window complete from right , pop left
-->   39             if j - i == k :
      40                 #
      41                 largest_index = monoth_window[0]
      42                 res.append(nums[largest_index])
      43                 if (largest_index == i):
      44                     monoth_window.popleft()
      45                 i += 1
      46         return res
```
```python
```
