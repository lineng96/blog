# 第2章：算法基础

## 2.1 插入排序

插入排序是一种简单直观的排序算法，基本思想是将一个记录插入已经排好序的有序列表中，从而得到一个新的、记录数加1的有序列表。
类似于整理扑克牌的过程，将手中的牌一张一张地插入已经有序的牌堆中。  
![扑克牌](https://cos.lineng.club/halo/20240505010545.png){width="300"}{border-effect=line}  
步骤如下：  
1.从第一个元素开始，该元素可以认为已经被排序。   
2.取出下一个元素，在已经排序的元素序列中从后向前扫描。  
3.如果该元素（已排序）大于新元素，将该元素移到下一位置。  
4.重复步骤3，直到找到已排序的元素小于或者等于新元素的位置。  
5.将新元素插入到该位置后。  
6.重复步骤2~5。  
第一轮：21比31小，交换位置；  
![第一轮](https://cos.lineng.club/halo/202405050141362.png){width="400"}{border-effect=line}
<img src="https://cos.lineng.club/halo/202405050141362.png" alt="completion suggestions for procedure" width="400" border-effect="line"/>