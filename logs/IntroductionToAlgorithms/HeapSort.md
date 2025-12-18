# 6.堆排序
堆排序具有空间原址性：任何时候都只需要常数个额外的元素空间存储临时数据。

**堆**是一个数组，可以看作是一个近似的完全二叉树。每个节点对应数组中的一个元素，最底层除外，该树是从左向右完全充满的。

堆性质定义了父节点与子节点之间的大小关系：

* **最大堆性质**：在最大堆中，除了根节点外的所有节点 $i$ ，都必须满足父节点的值大于或等于该节点的值。
$$A[PARENT(i)] ≥ A[i]$$
* **最小堆性质**：在最小堆中，除跟节点外的所有节点 $i$ ，都必须满足父节点的值小于或等于该节点的值。
$$A[PARENT(i)] ≤ A[i]$$

核心算法：

1. **MAX-HEAPIFY(最大堆调整)**：最关键的一步，假设一个节点 $i$ 的左子树和右子树都满足堆最大性质，但 $A[i]$
可能小于它的孩子。时间复杂度为 $O(lg \ n)$ 。
   1. 比较 $A[i]$ 、左孩子 $A[2i]$ 和右孩子 $A[2i + 1]$;
   2. 选出三者最大的一个；
   3. 如果最大值不是 $A[i]$ ，则交换 $A[i]$ 与该最大值；
   4. **递归调用**：交换后，原子节点可能会违法堆性质，因此需要递归MAX-HEAPIFY。
```cpp
void maxHeapify(vector<int> &A, const int i, const int heapSize) {

    const int left_child = 2 * i + 1;
    const int right_child = 2 * i + 2;
    int largest = i;

    if (left_child < heapSize && A[left_child] > A[largest]) {
        largest = left_child;
    }
    if (right_child < heapSize && A[right_child] > A[largest]) {
        largest = right_child;
    }
    if (largest != i) {
        swap(A[i], A[largest]);
        maxHeapify(A, largest, heapSize);
    }
}
```
2. **BUILD-MAX-HEAP(构建最大堆)**：从 $\lfloor \frac{n}{2} \rfloor$ 开始，因为在完全二叉树中，索引为$\lfloor \frac{n}{2} \rfloor + 1$ 到 $n$
的节点全部是**叶子节点**。叶子节点本身已经满足最大堆性质，所以只对所有非叶子节点自底向上进行调整。时间复杂度为 $O(n)$ 。
```cpp
void buildMaxHeap(vector<int> &A) {
    const int heapSize = A.size();
    for (int i = heapSize / 2 - 1; i >= 0; i--) {
        maxHeapify(A, i, heapSize);
    }
}
```
3. **HEAPSORT (排序过程)**：时间复杂度为 $O(n \ lg \ n)$。
   1. 把无序数组建成最大堆，此时最大值在 $A[0]$；
   2. 将 $A[0]$ 与数组最后一个元素交换；
   3. 逻辑上“去掉”这个最尾元素，对新的根节点调用MAX-HEAPIFY；
   4. 重复上述过程。
```cpp
void HeapSort::heapSort(vector<int> &A) {
    int heapSize = A.size();
    buildMaxHeap(A);
    for (int i = heapSize - 1; i > 0; i--) {
        swap(A[i], A[0]);
        heapSize--;
        maxHeapify(A, 0, heapSize);
    }
}
```
**总时间复杂度：**$O(n \ lg \ n)$ 。