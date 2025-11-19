# HashMap

HashMap 的核心是 **数组 + 链表 + 红黑树**，采用懒加载（Lazy Loading）模式，只有在第一次调用 `put()` 或者
其他需要操作底层数组的方法时才会真正的初始化数组。

## 1. 核心数据结构

HashMap 的底层是一个 `Node<K, V>` 数组（称为哈希桶数组），每个元素是一个链表或红黑树的头节点。`Node` 
是 HashMap 的内部类，其定义如下：
```java
static class Node<K,V> implements Map.Entry<K,V> {
        final int hash; // 哈希值
        final K key;    // 键
        V value;        // 值
        Node<K,V> next; // 指向下一个节点的指针（链表或红黑树中的下一个节点）

        Node(int hash, K key, V value, Node<K,V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
}
```
* `transient Node<K, V> table;`：存哈希存储桶，初始容量为16， 默认负载因子为0.75。
* **链表**：当多个键德尔哈希值映射到同一数组索引时，通过 `next` 指针形成链表。
* **红黑树**：当链表长度超过阈值（默认8）且数组长度 ≥ 64时，链表转换为红黑树，以提升查找效率（从 $O(n)$ 降至 $O(log n)$）。

## 2. 哈希函数与索引计算
HashMap 通过哈希函数将键映射到数组索引，核心步骤如下：

### 2.1 计算哈希值
调用键的`hashCode()`方法，生成32位原始哈希值，并通过扰动函数减少哈希冲突：
```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
* `key.hashCode()`：调用键对象的 `hashCode()` 方法，生成原始哈希值。
* `(h = key.hashCode()) ^ (h >>> 16)`：将原始哈希值右移16位后与原始哈希值进行异或运算，以减少哈希冲突。
  
之所以移动16位，是因为基于 Java 的 `int` 是32位，16正好是32的一半，将原始哈希值**均分**成两个部分：**高16位**
和**低16位**。
$$\text{Original Hash } h \text{ (32 bits)} =
\underbrace{\text{HHHH...H}}_{\text{High 16 bits}}
\underbrace{\text{LLLL...L}}_{\text{Low 16 bits}}$$
最终，有效地将原本会被忽略的**高位信息**“混合”并融入到最终用于计算索引的**低位**中。

### 2.2 计算索引
得到最终的哈希值`OriginalHash`后，使用**位运算**来确定它在底层数组（`Node[] table`）中的位置。

核心公式：
$$\text{Index} = \text{OriginalHash} \text{ \& } (\text{Capacity} - 1)$$
其中：
* **Index**：最终的数组索引（Bucket Index）；
* **OriginalHash**：经过步骤（1）扰动处理后的哈希值；
* **Capacity**：Hashmap 数组的当前长度（初始16，扩容按2的幂次方，例如：<16,32,64,...>）。

使用 `&` 和 `%`等价，但是 `&` 的**效率更高**，因为位运算直接在二进制级别上进行，而 `%` 需要除法运算。
## 3. 插入数据（put 方法）
`put` 方法核心逻辑如下：
```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash,
                K key, 
                V value, 
                boolean onlyIfAbsent,
                boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    //初始化数组
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    //计算索引，如果为空，直接插入
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        //如果键已存在，直接更新 (检查首节点 p）   
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        //如果为红黑树节点，递归插入
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        //否则遍历链表插入
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    //链表长度超过阈值8，转为红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        //更新值
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    //检查是否需要扩容
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
    }
```
## 4.扩容机制（resize 方法）
### 4.1 扩容触发条件
当实际元素数量超过**阈值**（Threshold）时，会进行扩容：

$$\text{Threshold} = \text{Capacity} \times \text{Load Factor}$$
其中：
* **Capacity（容量）**：底层 `Node[]table` 数组的当前长度（默认16）。
* **Load Factor（负载因子）**：默认0.75，表示当 `table` 中元素超过容量的75%时，会触发扩容。

**示例：** 如果初始容量是16，加载因子是0.75，那么当元素数量超过12（$16 * 0.75$）时，就会触发扩容。
### 4.2 扩容规模
触发扩容时，`HashMap` 会将新容量定为`原容量的2倍`，即 `newCapacity = oldCapacity << 1`,
保持容量始终是2的幂次方，以便高效的使用位与操作来 `hash & (N - 1)` 计算索引。
### 4.3 元素迁移
扩容最耗时的部分是将所有旧数组中的元素**重新分配**到新的数组中。这一过程称为**重新哈希（Rehashing）**，
因为数组的长度 $N$ 发生了变化，元素的索引也会发生变化。

对于 JDK7 之前，迁移采用**暴力重算**：对于旧数组中的每个元素，都需要重新计算哈希值，然后使用新容量来计算
新的索引位置。

对于 JDK8 及以后，利用容量翻倍的特性，**避免了对所有元素重新计算哈希值**。当容量从 $N$ 变成 $2N$ 时，一个
元素在新数组中的位置只有两种可能：

1. **保持不变：** 仍然在原索引 $i$ 的位置；
2. **新位置：** 移动到新索引 $i + N$ 的位置。

这是因为索引计算公式 `hash & (2N - 1)` 相比于 `hash & (N - 1)`，只多了一个 **N 位**
（原容量 N 对应的位）的参与。
* **判断依据：** 检查元素的哈希值中与原容量 N 对应的位是否为1。
  * 如果为0，新索引**保持不变**：$New Index = Old Index$；
  * 如果为1，新索引**移动**：$New Index = Old Index + N$。
```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    //数组已初始化（进行扩容）
    if (oldCap > 0) {
        if (oldCap >= MAXIMUM_CAPACITY) {
            //最大容量不再扩容
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        //容量和阈值都翻倍
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold （初始化已指定容量）
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults（默认16）
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    //最终确定阈值
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    //初始化新的数组
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;//将新数组赋值给table
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;//将旧数组置为null，方便GC
                //只有单个节点（无链表、红黑树）
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                //红黑树
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                //链表
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;//低位链表,索引不变
                    Node<K,V> hiHead = null, hiTail = null;//高位链表,索引为原索引+oldCap
                    Node<K,V> next;
                    do {
                        next = e.next;
                        //判断核心：检查 hash 值中新增的那个位 (oldCap 位) 是 0 还是 1
                        if ((e.hash & oldCap) == 0) {
                            // 如果该位是 0，则索引不变 (lo)
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            // 如果该位是 1，则索引变为原索引+oldCap (hi)
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);//遍历旧链表
                    //将两条新链表放入新数组的对应位置
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead; //原索引 j
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;//新索引： j + oldCap
                    }
                }
            }
        }
    }
    return newTab;
}
```
## 5.拆分机制（split 方法）
该方法主要负责 `HahMap` 扩容时，将当前索引 `index` 上的红黑树或链表（如果首节点是 `TreeNode`）中的所有节点，迁移到
新数组的两个目标位置：
1. **原索引：** `tab[index]`
2. **新索引:** `tab[index + oldCap]`

参数说明：
- `tab`：当前 `HashMap` 的数组
- `index`：当前索引，也是新数组中一组索引的起始存放索引
- `oldCap`：旧数组长度，用于计算判断新位置

### 5.1 线性化和分组
```java
TreeNode<K,V> b = this;
// Relink into lo and hi lists, preserving order
TreeNode<K,V> loHead = null, loTail = null;//低位链表的头尾
TreeNode<K,V> hiHead = null, hiTail = null;//高位链表的头尾
int lc = 0, hc = 0;
for (TreeNode<K,V> e = b, next; e != null; e = next) {
    next = (TreeNode<K,V>)e.next;
    e.next = null;//断开旧连接，准备重新链接
    
    //核心判断：决定节点去向
    if ((e.hash & bit) == 0) {//如果 hash 中与 oldCap 对应的位是 0 (索引不变)
        if ((e.prev = loTail) == null)// 设置双向链表的 prev 指针
            loHead = e;
        else
            loTail.next = e;
        loTail = e;
        ++lc;// 计数增加
    }
    else {// 如果 hash 中与 oldCap 对应的位是 1 (索引移动)
        if ((e.prev = hiTail) == null)
            hiHead = e;
        else
            hiTail.next = e;
        hiTail = e;
        ++hc;
    }
}
```
- **线性化：** 红黑树首先是通过 `next` 指针像链表一样遍历。遍历中，每个节点的 `next`指针被设置为 `null`，
并根据判断重新链接到新的 `lo` 和 `hi` 链表中。
- **双向链接：** 这里使用了 `e.prev = loTail` 和 `loTail.next = e` 来重新链接，形成双向链表。
主要是为了方便后续红黑树操作（红黑树节点保留了 prev 指针）。
- **分组：** 节点被分成 `loHead/loTail` （索引 $j$）和 `hiHead/hiTail` （索引 $j + oldCap$）
两个独立的新链表。

### 5.2 退化检查和重新树化
在节点分组完成后，对这两条新链表（`lo` 和 `hi`）分别检查其长度，以决定它们在新数组中应该以
**链表**还是**红黑树**的形式存在。

**A. 处理低位链表 （索引 `index`）**
```java
if (loHead != null) {
    if (lc <= UNTREEIFY_THRESHOLD)// 长度 <= 6 (退化阈值)
        tab[index] = loHead.untreeify(map);// 退化为普通链表
    else {
        tab[index] = loHead;/ 仍作为红黑树（长度 > 6）
        if (hiHead != null) // 如果 hi 链也存在，则 lo 链需要重新构建树结构
            loHead.treeify(tab);
    }
}
```
**B.处理高位链表（索引 `index + oldCap`）**
```java
if (hiHead != null) {
    if (hc <= UNTREEIFY_THRESHOLD)// 长度 <= 6 (退化阈值)
        tab[index + bit] = hiHead.untreeify(map);// 退化为普通链表
    else {
        tab[index + bit] = hiHead;// 仍作为红黑树
        if (loHead != null)
            hiHead.treeify(tab);// 重新构建树结构
    }
}
```
**总结**
1. **高效拆分：** 利用位运算（`e.hash & bit`）快速将树/链表拆分成两个链表。
2. **结构判断：** 根据链表长度$（lc，hc）$和阈值$6$，判断是否需要**退化/树化**。
3. **重新定位：** 将拆分后的结构放到新的数组 $j$ 和 $j + oldCap$ 位置。