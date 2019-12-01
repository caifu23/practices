getCarts();

function getCarts() {
    // 获取本地数据
    // 从本地查询
    let localData = new StorageChange();
    let arr = localData.searchStorageData('shopCart');

    // 计算总数
    let cartsCount = 0;
    arr.forEach(e => {
        cartsCount += e.count;
    });

    // 修改购物车气泡数
    $('.shopcar .count').text(cartsCount)
}