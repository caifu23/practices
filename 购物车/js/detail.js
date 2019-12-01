$(function() {
    // 获取location
    let id = location.search.substring(4);
    console.log(id)

    let target = phoneData.find((e) => {
        return id == e.pID
    });
    

    $('.itemInfo-wrap > .sku-name').text(target.name);
    $('.summary-price  em').text(`¥${target.price}`)
    $('.preview-img img').attr('src', target.imgSrc);


    // 点击购物车 数据存储到本地
    $('.addshopcar').on('click', function() {
        // 获取件数
        let count = $('input.choose-number').val();
        // 判断用户输入是否为数字，非则提示
        if(count.trim().length == 0 || isNaN(count)  || parseInt(count) <=0 ) {
            alert('请输入数字');
            return;
        }
        
        count = parseInt(count);
        
        // 先查询arr
        let localData = new StorageChange();
        let arr = localData.searchStorageData('shopCart');


        // 存储数据/或者数量改变
        
        let exist = arr.find( e => {
            // console.log('pID' + e.pID)
            return e.pID == target.pID
        });

        if(exist) {
            exist.count += count; 
        }else {
            let obj = {
                pID: target.pID,
                imgSrc: target.imgSrc,
                name : target.name,
                price: target.price,
                count: count,
                isCheck: true
            }
            arr.push(obj);
           
        }

        // 最终存储到本地
        localData.addData('shopCart', arr);
        // 跳转到购物车页面
        location.href = './cart.html';
    });
});