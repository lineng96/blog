# 7. 快速排序
快速排序也使用了 [2.3.1分治法](/IntroductionToAlgorithms/Getting-Started.html#_2-3-1-分治法)的分治思想。

核心算法：
1. **数组划分（PARTITION）**
   1. 选择最后一个元素为基准元素（pivot）。
   2. 使用两个指针 $i$ 和 $j$ ，$j$ 负责扫描数组，$i$ 负责标记“小于基准区域”的边界。
   3. 如果 $A[j] ≤ Pivot$，则 $i$ 向右移一位，并交换 $A[i]$ 和 $A[j]$ 。
```cpp
int partition(vector<int> &A, const int p, const int r) {
    const int x = A[r];
    int i = p - 1;

    for (int j = p; j < r; j++) {
        if (A[j] <= x) {
            i++;
            swap(A[i], A[j]);
        }
    }
    swap(A[i + 1], A[r]);
    return i + 1;
}
```
2. **递归（QUICKSORT）**
```cpp
void quickSort(vector<int> &A, const int p, const int r) {
    if (p < r) {
        // 划分后的基准位置
        const int q = partition(A, p, r);
        quickSort(A, p, q - 1);
        quickSort(A, q + 1, r);
    }
}
```
性能分析：

快速排序的运行时间取决于**划分是否平衡**：

* **最坏情况**：每次划分产生的子问题分别包含 $n - 1$ 个元素和 0 个元素，时间复杂度为 $O(n^2)$ 。
* **最好情况**：每次划分产生的子问题分别包含 $\frac{n}{2}$ 个元素和 $\frac{n}{2}$ 个元素，时间复杂度为 $O(n \log n)$ 。
* **平均情况**：即使划分的比例是 9:1 ，时间复杂度依旧为 $O(n \log n)$ 。