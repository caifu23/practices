// 获取到 产品id，数量 
$(function() {
    // 从本地存储查询
    let localData = new StorageChange();
    let arr = localData.searchStorageData('shopCart');
    

    // 如果查询到数据，隐藏 “空空如也”，显示头部和价格结算
    if(arr.length != 0) {
      $('.empty-tip').hide();
      $('.cart-header').show();
      $('.total-of').show();
    }

    // 遍历获得的本地购物车数据，显示到购物车页面上
    arr.forEach(ele => {
       
        let html = `<div class="item" data-id="${ele.pID}">
        <div class="row">
        <div class="cell col-1 row">
          <div class="cell col-1">
            <input type="checkbox" class="item-ck" ${ele.isCheck ? 'checked' : ''}>
          </div>
          <div class="cell col-4">
            <img src="${ele.imgSrc}" alt="">
          </div>
        </div>
        <div class="cell col-4 row">
          <div class="item-name">${ele.name}</div>
        </div>
        <div class="cell col-1 tc lh70">
          <span>￥</span>
          <em class="price">${ele.price}</em>
        </div>
        <div class="cell col-1 tc lh70">
          <div class="item-count">
            <a href="javascript:void(0);" class="reduce fl">-</a>
            <input autocomplete="off" type="text" class="number fl" value="${ele.count}">
            <a href="javascript:void(0);" class="add fl">+</a>
          </div>
        </div>
        <div class="cell col-1 tc lh70">
          <span>￥</span>
          <em class="computed">${ele.count * ele.price}</em>
        </div>
        <div class="cell col-1">
          <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
        </div>
      </div>
      </div>`

      $('.item-list').append(html)
     
       
    });

    // 判断全选按钮是否 需要勾选
    // 通过 点选按钮长度 与 勾选的点选按钮长度 比较
    // if($('.item-ck').length != $('.item-ck:checked')) {
    //   $('.pick-all').prop('checked', false);
    // }
    let ckStatus = $('.item-ck').length == $('.item-ck:checked').length;
      $('.pick-all').prop('checked', ckStatus);
      

    // 页面加载时，初始化价格和数量
    getTotal();


    // 注册 数量添加和减少按钮 点击事件
    // 动态生成，所以用事件委托

    // 点击+号，数量加一，是在input最新值上更改，并显示
    $('.item-list').on('click', '.add', function() {
      // 获取当前的产品id
      let id = $(this).parents('.item').attr('data-id');
      
      // 获取原来的值(基于+号左边的兄弟元素input)
      let odd = $(this).prev().val();

      // 更新input里的值
      $(this).prev().val( ++odd );

      // 更新到本地存储
      let arr = localData.searchStorageData('shopCart');
      let obj = arr.find( e => {
        return e.pID == id;
      })
      obj.count = odd;
      
      localData.addData('shopCart', arr)

      // 更新底部总价总数，右边的总价
      getTotal();
      // find(jq方法，基于父元素下，查找子元素对象)
      $(this).parents('.item').find('.computed').text(obj.price * obj.count)


    });

    // 点击-号，数量减一，减一前判断当前数量是否为1，
    //若是则从购物车删除，更新本地存储数据
    $('.item-list').on('click', '.reduce', function() {
      
       // 获取当前的产品id
       let id = $(this).parents('.item').attr('data-id');
      
       // 获取原来的值(基于+号左边的兄弟元素input)
       let odd = $(this).next().val();

       if(odd <=1 ) {
         // 可以再判断件数为1时，提醒用户无法再减，是否删除该产品 ？？？?
        alert('当前是件数为1，可以选择删除')
        return;
       }

       // 更新input里的值
       $(this).next().val( --odd );
 
       // 更新到本地存储
       let arr = localData.searchStorageData('shopCart');
       let obj = arr.find( e => {
         return e.pID == id;
       })
       obj.count = odd;
       
       localData.addData('shopCart', arr)
 
       // 更新底部总价总数，右边的总价
       getTotal();
       // find(jq方法，基于父元素下，查找子元素对象)
       $(this).parents('.item').find('.computed').text(obj.price * obj.count)

    });

    // input 聚焦
    $('.item-list').on('focus', 'input.number',  function() {
      
      // 获取值，判断用户输入是否有效
      let oldVal = parseInt( $(this).val() )
      
      // 将旧值保存再本身，用于用户非法输入，恢复该值
      $(this).attr('data-old', oldVal)

    });

    // input值改变时，更新到本地存储
    // 判断值是否为数字
    $('.item-list').on('blur', 'input.number',  function() {
      // 获取当前更改的产品id
      let id = $(this).parents('.item').attr('data-id')
  
      // 获取值，判断用户输入是否有效
      let countVal = $(this).val() 
      

      // 获取原先保存的旧值
      let old = $(this).attr('data-old');
      if(countVal.trim().length == 0 || isNaN(countVal)  || parseInt(countVal) <=0 ) {
        alert('请输入有效的数量：数字');
        
        $(this).val(old);
        return;
      }
      countVal = parseInt(countVal);

      // 判断当前的值如果跟旧值一样，则不执行接下来的操作
      if( countVal == old ) {
        console.log('数据是最新')
        return;
      }
      

       // 更新到本地存储
       let arr = localData.searchStorageData('shopCart');
       let obj = arr.find( e => {
         return e.pID == id;
       });

       obj.count = countVal;
       localData.addData('shopCart', arr);

       // 更新底部总价总数，右边的总价
       getTotal();
       // find(jq方法，基于父元素下，查找子元素对象)
       $(this).parents('.item').find('.computed').text(obj.price * obj.count);

       // 更新data-old
       $(this).attr('data-old', countVal);


    });


    // input 按下回车时，存储旧值 可省略，因为此时发生前必有聚焦？？
    $('.item-list').on('keydown', 'input.number',  function(e) {
      console.log('按下回车');
        if(e.keyCode == 13) {
          
         let oldVal =  $(this).attr('data-old')
         $(this).attr('data-old', oldVal)
          
        }

    });

    // input值改变后，按下回车 弹起后
    $('.item-list').on('keyup', 'input.number', function(e) {
      // 判断键盘按下 是否是 回车
      if(e.keyCode == 13) {

        // 获取当前更改的产品id
        let id = $(this).parents('.item').attr('data-id')
    
        // 获取值，判断用户输入是否有效
        let countVal = $(this).val() 
       

        // 获取原先保存的旧值
        let old = $(this).attr('data-old');
        if(countVal.trim().length == 0 || isNaN(countVal)  || parseInt(countVal) <=0 ) {
          alert('请输入有效的数量：数字');
          
          $(this).val(old);
          return;
        }
        countVal = parseInt(countVal);

        // 判断当前的值如果跟旧值一样，则不执行接下来的操作
        if( countVal == old ) {
          console.log('数据是最新')
          return;
        }
        

        // 更新到本地存储
        let arr = localData.searchStorageData('shopCart');
        let obj = arr.find( e => {
          return e.pID == id;
        });

        obj.count = countVal;
        localData.addData('shopCart', arr);

        // 更新底部总价总数，右边的总价
        getTotal();
        // find(jq方法，基于父元素下，查找子元素对象)
        $(this).parents('.item').find('.computed').text(obj.price * obj.count);

        // 更新data-old
        $(this).attr('data-old', countVal);

      }
    });

    // 购物车删除,事件监听
    // 删除提示用户
    // 页面删除产品 + 本地存储删除该产品数据
    $('.item-list').on('click', '.item-del', function() {
      layer.confirm('你确定要删除吗?', {icon: 0, title:'警告'}, (index)=>{
        layer.close(index);
        // 执行用户，点击确定删除的操作
        // 当前this之所以指向 上一层作用域，是因为 => 箭头语法没有this 
        let delId = $(this).parents('.item').attr('data-id') // 字符串
       
        // 页面上删除该商品列
        $(this).parents('.item').remove();

        // 更新到本地存储(从本地存储里删除)
       let arr = localData.searchStorageData('shopCart');
       arr = arr.filter( e => {
         return e.pID != delId;
       })
       localData.addData('shopCart', arr);

       // 更新底部总价总数，右边的总价
       getTotal();
        
      });
    })



    // 全选和点选的实现：
    // 1、 全选则 全部的点选都 同状态
    // 2、 一个点选不勾选，全选不勾选
    // 3、 勾选状态改变，更新到本地存储，更新价格，件数
    // 4、 全选按钮一共有2个
    let ckAll = $('input.pick-all');
    let ckItem = $('input.item-ck');
    
    // 点击全选
    ckAll.on('click', function() {
      let status = $(this).prop('checked');
      
      ckItem.prop('checked', status);
      ckAll.prop('checked', status);

      // 更新本地数据
      // 这里是否需要重新获取arr ？？?
      let arr = localData.searchStorageData('shopCart');
      arr.forEach( e => {
        e.isCheck = status;
      });
     
      // 将数据保存
      localData.addData('shopCart', arr);

      // 更新价格和数量
      getTotal();

    });

    // 点击点选
    // 动态生成的内容，所以用事件委托
    $('.item-list').on('click', '.item-ck', function() {
     
      let ckStatus = $('.item-ck').length == $('.item-ck:checked').length;
      $('.pick-all').prop('checked', ckStatus);
      
      // 将数据保存
      // 这里是否需要重新获取arr ？？?
      // 获取当前的pID
      let pID = $(this).parents('.item').attr('data-id');
      
      let arr = localData.searchStorageData('shopCart');
      let ele = arr.find( e =>  {
          return e.pID == pID;
      });
      
      ele.isCheck = $(this).prop('checked');
      
      // 存储到本地
      localData.addData('shopCart', arr);

      // 更新价格和数量
      getTotal();

    });




    // 计算 封装
    // 总件数、总价格
    function getTotal() {
      // 从本地里获取
      let arr = localData.searchStorageData('shopCart');
      let totalCount = 0;
      let totalPrice = 0;
      
      arr.forEach(e => {
        // 判断是否勾选, 勾选计入
        if(e.isCheck) {
          totalCount += e.count;
          totalPrice += e.count * e.price;
        }

      });
      // 将价格和件数更新到页面
      $('.selected').text(totalCount);
      $('.total-money').text(totalPrice)
    }


});