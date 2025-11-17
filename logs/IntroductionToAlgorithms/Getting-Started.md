# 算法基础
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
