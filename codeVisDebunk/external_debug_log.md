```python
```python                                                          │ ┌───────────────────────────────────────────────────┐
      99     def removeDuplicates(self, nums: List[int]) -> int:   │ │ Started expanding window
     100         pdb.set_trace(start_line=98, end_line=111)        │ │
     101         l, r = 0, 0                                       │ │ Indices: 0  1  2  3  4  5  6  7  8  9  
     102         for r in range(len(nums)):                        │ │ Input:   1  2  3  4  5  3  4  4  5  5  
     104             if nums[r] != nums[l]:                        │ │
     105                 l += 1                                    │ │ Current Array State:
     106                 nums[l] = nums[r]                         │ │          1  2  3  4 [5  3  4  4  5  5] │
-->  107         end = l + 1                                       │ │
     108         while end < len(nums):                            │ │ Pointer Positions:
     109             nums[end] = '_'                               │ │                     L                R
     110             end += 1                                      │ │
     111         return l + 1                                      │ │ Left pointer (L) at index 4, value: 5
```                                                                │ │ Right pointer (R) at index 9, value: 5
                                                                   │ └───────────────────────────────────────────────────┘
                                                                  
```
