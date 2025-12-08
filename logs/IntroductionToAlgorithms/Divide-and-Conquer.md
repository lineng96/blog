# 4.分治策略
**递归式：** 分治算法的运行时间通常由**递归式**来描述。

三种求解**递归式**的方法：
* **代入法（Substitution Method）**：猜测一个界，然后使用数学归纳法证明这个界是对的。
* **递归树法（Recursion-Tree Method）**：将递归式转化成一棵树。树中的每个节点代表一个子问题的代价。
计算树中所有节点的代价之和，得到递归式的解。
* **主方法（Master Method）**：可求解形如下面公式的递归式的界：
$$T(n) = aT(\frac{n}{b}) + f(n)$$
可以看作是一个“即插即用”的**通用定理**。只需将 $a$、$b$ 和 $f(n)$ 代入，并根据 $f(n)$ 与 $n^{\log_b a}$ 的渐近比较，
选择对应的三种情况之一。这里，$a ≥ 1$ 是子问题的数量，$b > 1$ 是输入规模的缩减因子，$f(n)$ 是分解合并的操作代价。

## 4.1 最大子数组问题
### 4.1.1 使用暴力求解法查找最大子数组
时间复杂度：$O(n^2)

步骤：

1. 遍历数组的每个元素作为子数组的起点$i$；
2. 对于每个起点$i$，遍历其后所有元素作为终点$j$（$j ≥ i$）；
3. 计算数组$A[i..j]$ 的和，并更新最大子数组和及其起点和终点。
```cpp
void Find_max_subarray::maxSubarrayByBruteForce(const std::vector<int> &prices) {
    const size_t n = prices.size();
    int max_profit = 0;
    int start = 0, end = 0;
    for (int i = 0; i < n; i++) {
        int current_sum = 0;
        for (int j = i; j < n; j++) {
            current_sum += prices[j];
            if (current_sum > max_profit) {
                max_profit = current_sum;
                start = i;
                end = j;
            }
        }
    }
    std::cout << "Maximum subarray: a[" << start << ".." << end << "] = { ";
    for (int i = start; i <= end; i++) {
        std::cout << prices[i] << " ";
    }
    std::cout << "}" << std::endl;
    std::cout << "Sum: " << max_profit << std::endl;
}
```
### 4.1.2 使用分治法查找最大子数组

对于给定数组 $A[low..high]$ 和其中点 $mid$，最大子数组 $A[i..j]$ 只以下三种情况：
1. **完全位于左侧**：$low ≤ i ≤ j ≤ mid$ ；
   * 递归求解 $A[low..mid]$ 的最大子数组。
2. **完全位于右侧**：$mid+1 ≤ i ≤ j ≤ high$ ；
   * 递归求解 $A[mid+1..high]$ 的最大子数组。
3. **跨越中点**：$low ≤ i ≤ mid < j ≤ high$ ；
    * 这个子数组必须包含 $A[mid]$ 和 $A[mid+1]$。

计算方法：
* 左半部分：从 $mid$ 向左遍历到 $low$ ，找到包含 $A[mid]$ 的最大和 $S_L$ 。
* 右半部分：从 $mid+1$ 向右遍历到 $high$ ，找到包含 $A[mid+1]$ 的最大和 $S_R$ 。
* 跨越中点：跨越中点的最大数组和即为 $S_cross = S_L + S_R$ 。

运行时间：
$$T(n) = 2T(n/2) + O(n)$$ 
* $T(n/2)$ 是递归求解左右两部分的最大子数组；
* $O(n)$ 合并处理步骤，是求解跨越中点的最大子数组。

根据 2.3.1 主定理计算可得：分治策略的最大子数组算法的运行时间是 $O(n \log n)$。
```cpp
struct MaxSubarrayResult {
        int start;
        int end;
        int sum;
};
MaxSubarrayResult findMaxCrossingSubarray(const std::vector<int> &prices, int low, int mid, int high) {
    //search left
    int left_sum = std::numeric_limits<int>::min();
    int sum = 0;
    int max_left = mid;
    for (int i = mid; i >= low; i--) {
        sum += prices[i];
        if (sum > left_sum) {
            left_sum = sum;
            max_left = i;
        }
    }

    //search right
    int right_sum = std::numeric_limits<int>::min();
    sum = 0;
    int max_right = mid + 1;
    for (int j = mid + 1; j <= high; j++) {
        sum += prices[j];
        if (sum > right_sum) {
            right_sum = sum;
            max_right = j;
        }
    }
    // Return merged results
    return {max_left, max_right, left_sum + right_sum};
}

MaxSubarrayResult findMaximumSubarray(const std::vector<int> &prices, int low, int high) {
    if (low == high) {
        return {low, high, prices[low]};
    }
    const int mid = (low + high) / 2;
    const MaxSubarrayResult left = findMaximumSubarray(prices, low, mid);
    const MaxSubarrayResult right = findMaximumSubarray(prices, mid + 1, high);
    const MaxSubarrayResult cross = findMaxCrossingSubarray(prices, low, mid, high);

    //Return max
    if (left.sum >= right.sum && left.sum >= cross.sum) {
        return left;
    }
    if (right.sum >= left.sum && right.sum >= cross.sum) {
        return right;
    }
    return cross;
}
```