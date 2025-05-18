import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AlgoViz from './AlgoViz';
import DynamicProgrammingViz from './DynamicProgrammingViz';


function MainPage() {
    let code = `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`;
    // simple 2d  dp that takes nums and target
    let code2 = `def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1): 
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
                
    return dp[m][n]
    `;
    let data1 = {
        // nums: [2, 7, 11, 15, 3, 9, 8, 1],
        // target: 11,
        text1: "abcde",
        text2: "ace",
        code: code2
      }
    let data2 = {
        nums: [2, 7, 11, 15, 3, 9, 8, 1],
        target: 11,
        code: code
      }
    return (
       <div>
        <AlgoViz algorithmClass="dynamic-programming" request={data1}/>
        <AlgoViz algorithmClass="binary-search" request={data2}/>
       </div>
    );
}

export default MainPage;
