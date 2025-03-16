#!/usr/bin/env python
# codeVisDebunk/codevisdebunk/run_viz.py

from codevisdebunk.poc_debug_viz import ColorPdb
import heapq
from typing import List

pdb = ColorPdb()


for i in range(17, 27):
    pdb.set_break(__file__, i)
#     Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.



def absolutePermutation(n, k):
    pdb.set_trace(start_line=17, end_line=27, variables=[ "n", "k"])
    print(n, k)
    return []

absolutePermutation(10, 2)
