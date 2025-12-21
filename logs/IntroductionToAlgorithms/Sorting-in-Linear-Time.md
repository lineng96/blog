# 8. 线性时间排序
任何比较排序算法（如堆排序、快排、归并排序）在最坏情况下的下界都是 $\Omega(n\log n)$。为了突破限制，线性时间排序法利用输入数据的**特殊性质**（如数据范围、分布规律等）来决定元素的顺序。

## 8.1 计数排序
核心思想：**不比较、只计数**

对于每一个输入元素 $x$ ，确定小于 $x$ 的元素个数。利用这一信息，将 $x$ 放在输出数组的第 $k$ 个位置。

适用前提：
* 整数类型：输入的元素必须是整数。
* 范围有限：假设输入的 $n$ 个数都在 $0$ 到 $k$ 的范围内。当 $k = O(n)$ 时，排序的复杂度才是线性的$O(n)$ 。

步骤：

假设输入数组为 $A$ ，输出数组为 $B$ ，辅助存储空间为 $C$（长度为 $k + 1$）。 
1. **初始化**：将 $C$ 数组清零；
2. **计数**：遍历 $A$ ，统计每个值出现的次数。$C[i]$ 保存了值 $i$ 出现的频率；
3. **累加（计算前缀和）**：对 $C$ 进行累加运算，$C[i] = C[i] + C[i - 1]$ ，$C[i]$ 保存了小于或等于 $i$ 的元素个数；
4. **反向填充**：**从后往前**遍历 $A$ ，根据 $C$ 中的值将 $A[j]$ 放入 $B$ 的对应位置，每放一个 $C$ 中对应的计数 $- 1$ 。
```cpp
vector<int> countingSort(const vector<int> &A, const int k) {
    const int n = A.size();
    vector<int> B(n);
    vector C(k + 1, 0);

    // 1. 频率
    for (int j = 0; j < n; j++) {
        C[A[j]]++;
    }
    // 2.累加频率
    for (int i = 1; i <= k; i++) {
        C[i] += C[i - 1];
    }
    // 3.反向填充
    for (int j = n - 1; j >= 0; j--) {
        B[C[A[j]] - 1] = A[j];
        C[A[j]]--;
    }
    return B;
}
```
## 8.2 基数排序
核心思想：**逐位比较**

通常采用 **LSD（Least Significant Digit，最低有效位）**优先的策略；先按个、十、百...位直到最高位排序。在对每一位进行排序时，必须使用**稳定**的排序算法（例如计数排序）。

从**低位**开始，只需要对整个数组进行 $d$ 次（$d$ 为位数）稳定的全局排序。由于低位的顺序会在高位排序中“稳定地”保留，最终结果依然是有序的。如果从高位（MSB）开始排，需要单独维护高位的顺序。

```cpp
// 获取数组中的最大值，确定需要排多少位
int getMax(const vector<int> &A) {
    int maxValue = A[0];
    for (const int x: A) {
        if (x > maxValue) {
            maxValue = x;
        }
    }
    return maxValue;
}

// 对于特定的位进行稳定的计数排序（exp，例如：1，10，100，...）
void countingSortForRadix(vector<int> &A, const int exp) {
    const int n = A.size();
    vector<int> output(n);
    int count[10] = {0};

    // 1.统计当前位(A[i] / exp) % 10出现的次数
    for (int i = 0; i < n; i++) {
        count[A[i] / exp % 10]++;
    }

    // 2.累加频率，确定位置
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // 3.反向填充（保持稳定性）
    for (int i = n - 1; i >= 0; i--) {
        const int digit = A[i] / exp % 10;
        output[count[digit] - 1] = A[i];
        count[digit]--;
    }

    //4.写回原数组
    for (int i = 0; i < n; i++) {
        A[i] = output[i];
    }
}

void radixSort(vector<int> &A) {
    const int m = getMax(A);

    //从个位开始执行
    for (int exp = 1; m / exp > 0; exp *= 10) {
        countingSortForRadix(A, exp);
    }
}
```
时间复杂度：

假设 $n$ 个数，每个数$d$ 位，基数 $k$（例如10进制 $k = 10$) ，时间复杂度为 $O(d (n + k)) = O(n)$。

如果底层使用子排序算法是稳定的（例如计数排序），那么这个算法就是稳定的。