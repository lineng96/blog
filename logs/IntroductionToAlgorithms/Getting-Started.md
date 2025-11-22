# 2.算法基础
## 2.1 插入排序
工作原理是：将数组分为已排序和未排序的两部分，然后逐步将未排序部分的元素插入到 已排序部分的正确位置；
核心是比较和移动。

时间复杂度: $O(n^2)$

C++实现：
```cpp
void Insertion_sort::sort(std::vector<int> &arr) {
    const int n = arr.size();
    for (int i = 1; i < n; ++i) {
        const int current_value = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > current_value) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current_value;
    }
}
//Reverse order
void Insertion_sort::reverseSort(std::vector<int> &arr) {
    const int n = arr.size();
    for (int i = 0; i < n; ++i) {
        const int current_value = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] < current_value) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current_value;
    }
}
```
## 2.2 分析算法
重点集中于只求**最坏情况运行时间**，关注运行时间的**增长率**或**增长量级**。

## 2.3 设计算法
### 2.3.1 分治法
将问题分解为规模更小的子问题，递归求解这些子问题，然后合并这些子问题的解得到原问题的解。

分治模式在每层递归时都有三个步骤：
* **分解**原问题为若干子问题，这些子问题是原问题规模较小的实例。
* **解决**这些子问题，递归地求解这些子问题。若子问题的规模足够小，则停止递归，直接求解。
* **合并**这些子问题的解得到原问题的解。

**归并排序**完全遵循上述分治模式，其运行时间$T(n)$通过递归式描述如下：
1. **分解（Divide）：** 将数组分成两半，时间为$\Theta(1)$；
2. **解决（Conquer）：** 递归调用归并排序，对两个$n/2$大小的子问题排序，时间为$2T(n/2)$；
3. **合并（Combine）：** 合并两个$n/2$大小的有序数组，时间为$\Theta(n)$。

将这三个步骤加起来，得到归并排序的运行时间递归式：
$$T(n) = \begin{cases} \Theta(1) & \text{if } n=1 
\\ 2T(n/2) + \Theta(n) & \text{if } n>1 \end{cases}$$
通过求解上述公式（递归树法），可以得出归并排序渐进运行时间：
$$\text{最坏情况运行时间：}\quad \Theta(n \log n)$$
为什么是$O(n log n)$？
* **层数$(log n)$：** 分解过程每次将问题规模减半，直到规模为1，递归树有$\log_2 n$层；
* **每层工作量$(n)$：** 在每一层递归中（无论数组被分成多少块），所有子数组的**合并工作量**都是$n$（即$\Theta(n)$）。
* **总工作量：** 总运行时间 = 层数 $\times$ 每层工作量 $= \log n \times n = n \log n$。

因此，归并排序比插入排序（$O(n^2)$）在处理大规模数据时要快得多。
```cpp
using namespace std;
void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    vector<int> L(n1);
    vector<int> R(n2);
    
    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1+ j];
    }
    
    int i = 0;
    int j = 0;
    int k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void Merge_sort::mergeSort(vector<int>& arr, int left, int right) {

    if (left < right) {
        int mid = left + (right - left) / 2;
        
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        merge(arr, left, mid, right);
    }
}

```