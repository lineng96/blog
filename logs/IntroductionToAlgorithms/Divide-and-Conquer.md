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
### 4.1.1 暴力求解法查找最大子数组
时间复杂度：$O(n^2)$

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
### 4.1.2 分治法查找最大子数组

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
$$T(n) = 2T(\frac{n}{2}) + O(n)$$ 
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
## 4.2 矩阵乘法的 Strassen 算法

### 4.2.1 暴力求解矩阵乘法
1. 原理： 对于两个 $n × n$ 的矩阵 $A$ 和 $B$ ，其乘积 $C$ 也是一个 $n × n$ 的矩阵。基本规则是：结果矩阵 $C$ 中的元素 $c_{ij}$，等于矩阵 $A$
的第 $i$ 行元素与矩阵 $B$ 的第 $j$ 列元素对应相乘后的和。
$$c_{ij} = \sum_{k=1}^{n} a_{ik}\cdot b_{kj}$$
2. 实现：
   1. **外层循环（$i$）**：遍历结果矩阵 C 的行索引（$1到n$）；
   2. **二层循环（$j$）**：遍历结果矩阵 C 的列索引（$1到n$）;
   3. **内层循环（$k$）**：点积操作，计算 $A$ 的第 $i$ 行和 $B$ 的第 $j$ 列的乘积和（$1到n$）。
3. 代码：
```cpp
using namespace std;
vector<vector<int>> Matrix_multiplication::bruteForce(const vector<vector<int> > &A, 
                                                      const vector<vector<int> > &B,
                                                      const int n) {
    vector C(n, vector(n, 0));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
```
4. 时间复杂度：

   * 循环次数：$i,j,k$ 各 $n$ 次，总计循环 $n^3$ 次。
   * 乘法操作：对于结果矩阵中的每一个元素 $C_{ij}$ ，需要 $n$ 次乘法， $n^2$ 个元素，所以需要乘 $n^3$ 次。
   * 加法操作：对于结果矩阵中的每一个元素 $C_{ij}$ ，需要 $n - 1$ 次加法，总计约为 $n^3$ 次。

因此，暴力算法矩阵乘法的时间复杂度为：$O(n^3)$。

### 4.2.2 Strassen 算法

Strassen 算法将矩阵乘法的时间复杂度降到 $\Theta(n^{lg7})\approx \Theta(n^{2.81})$ ，核心思想是令树不那么茂盛一点儿，只递归进行 7 次，
而不是 8 次 $\frac{n}{2} \times \frac{n}{2}$ 的矩阵的乘法。

Strassen 算法递归式：
$$T(n) = \begin{cases}\Theta(1) & \text{if }n=1 \\ 7T(\frac{n}{2})+\Theta (n^2) & \text{if }n>1  \end{cases} $$

Strassen 算法总共分为4步：
1. 将$n \times n$ 的输入矩阵$A,B$ 和输出矩阵 $C$ 分割成 4 个 $\frac{n}{2} \times \frac{n}{2}$ 的子矩阵
```cpp
vector<vector<int> > MatrixMultiplication::matrixStrassen(const vector<vector<int> > &A,
                                                           const vector<vector<int> > &B,
                                                           const int n) {
   const int half = n / 2;
   vector<vector<int> > A11(half, vector<int>(half)), A12(half, vector<int>(half)),
                        A21(half, vector<int>(half)), A22(half, vector<int>(half));
   vector<vector<int> > B11(half, vector<int>(half)), B12(half, vector<int>(half)),
                        B21(half, vector<int>(half)), B22(half, vector<int>(half));

   matrixSplit(A, A11, A12, A21, A22, n);
   matrixSplit(B, B11, B12, B21, B22, n);
```
2. 创建 10 个 $\frac{n}{2} \times \frac{n}{2}$ 的矩阵 $S_1,S_2,..,S_{10}$ ，每个矩阵保存步骤 1 中创建的两个子矩阵的和或差。
花费时间 $\Theta(n^2)$ 。
```cpp
   // S1 = B12 - B22
   vector<vector<int> > S1 = matrixSub(B12, B22, half);
   // S2 = A11 + A12
   vector<vector<int> > S2 = matrixAdd(A11, A12, half);
   // S3 = A21 + A22
   vector<vector<int> > S3 = matrixAdd(A21, A22, half);
   // S4 = B21 - B11
   vector<vector<int> > S4 = matrixSub(B21, B11, half);
   // S5 = A11 + A22
   vector<vector<int> > S5 = matrixAdd(A11, A22, half);
   // S6 = B11 + B22
   vector<vector<int> > S6 = matrixAdd(B11, B22, half);
   // S7 = A12 - A22
   vector<vector<int> > S7 = matrixSub(A12, A22, half);
   // S8 = B21 + B22
   vector<vector<int> > S8 = matrixAdd(B21, B22, half);
   // S9 = A11 - A21
   vector<vector<int> > S9 = matrixSub(A11, A21, half);
   // S10 = B11 + B12
   vector<vector<int> > S10 = matrixAdd(B11, B12, half);
```
3. 使用步骤 1 中创建的子矩阵和步骤 2 创建的 10 个矩阵，递归计算 7 个矩阵积 $P_1,P_2,..,P_7$ ，每个矩阵 $P_i$ 都是 $\frac{n}{2} \times \frac{n}{2}$ 的。
```cpp
   vector<vector<int> > P1 = matrixStrassen(A11, S1, half);
   vector<vector<int> > P2 = matrixStrassen(S2, B22, half);
   vector<vector<int> > P3 = matrixStrassen(S3, B11, half);
   vector<vector<int> > P4 = matrixStrassen(A22, S4, half);
   vector<vector<int> > P5 = matrixStrassen(S5, S6, half);
   vector<vector<int> > P6 = matrixStrassen(S7, S8, half);
   vector<vector<int> > P7 = matrixStrassen(S9, S10, half);
```
4. 通过 $P_i$ 矩阵的不同组合进行加减运算，计算出结果矩阵 $C$ 的子矩阵 $C_{11},C_{12},C_{21},C_{22},$ ，花费时间 $\Theta(n^2)$ 。
```cpp
   // C11 = P5 + P4 - P2 + P6
   vector<vector<int> > C11_temp1 = matrixAdd(P5, P4, half);
   vector<vector<int> > C11_temp2 = matrixSub(C11_temp1, P2, half);
   vector<vector<int> > C11 = matrixAdd(C11_temp2, P6, half);
   
   // C12 = P1 + P2
   vector<vector<int> > C12 = matrixAdd(P1, P2, half);
   
   // C21 = P3 + P4
   vector<vector<int> > C21 = matrixAdd(P3, P4, half);
   
   // C22 = P5 + P1 - P3 - P7
   vector<vector<int> > C22_temp1 = matrixAdd(P5, P1, half);
   vector<vector<int> > C22_temp2 = matrixSub(C22_temp1, P3, half);
   vector<vector<int> > C22 = matrixSub(C22_temp2, P7, half);
   
   //5、合并 C_ij 结果得到矩阵 C
   vector C(n, vector<int>(n));
   matrixJoin(C, C11, C12, C21, C22, n);
   
   return C;
}
```

   