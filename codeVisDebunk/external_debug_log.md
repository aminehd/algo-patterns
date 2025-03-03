```python
```python                                                    
      93     def twoSum(self, nums, target):                 
      94         pdb.set_trace(start_line=92, end_line=104)   │ ┌───────────────────────────────────────────────────┐
      95         nums.sort()                                  │ │ Inward traversal
      96         l, r = 0, len(nums) - 1                      │ │ 🚪1 4  6  8  9  11  15  17  20 25🚪 30  50  
      97         while l < r:                                 │ │ 🚪↑  ·  ·  ·  ·  ·   ·   ·   ·  ↑🚪          
      99             if nums[l] + nums[r] == target:          │ │ 1 + 25 = 26 (too large, need 3 less)           │
     100                 return [l, r]                        │ │ target=23                                         │
-->  101             elif nums[l] + nums[r] < target:         │ └───────────────────────────────────────────────────┘
     102                 l += 1                              
     103             else:                                   
     104                 r -= 1                              
```                                                          
```
