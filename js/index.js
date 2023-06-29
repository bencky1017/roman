$(function () {
    /** 页面控件操作
     * 识别输入内容
     * 生成转换结果
     */
    // 回车按键绑定
    $('.get_value_input').on('focus keydown', function (event) {
        // 你按了键盘enter
        if (event.keyCode == 13) { $('.get_value_btn').click(); }
    });

    // 点击按钮获取输入的数据
    $('.get_value_btn').on('click', function getValue() {
        var get_input = $('.get_value_input').val();
        // var get_input = 134945584;
        // $('.get_value_input').val(get_input)
        // 类型判断，1为罗马，0为数字,-1为空
        var type_flag = isNaN(get_input) ? 1 : get_input != '' ? 0 : -1
        var result = type_flag == -1 ? `输入框为空` : type_flag ? ra(get_input, 1) : ar(get_input, 1)
        console.clear()
        console.log(type_flag, result)

        // 提示信息区操作
        if (type_flag == 1 && result[1].length > 0) {
            $('.output_tips').css({ 'display': '' }).siblings().css({ 'display': 'none' })
            var tips_string = ''
            // 提示信息换行
            for (var index in result[1]) {
                tips_string += result[1][index];
                tips_string += index != result[1].length - 1 ? '<br/>' : ''
            }
            $('.output_tips p').html(tips_string);
        } else if (type_flag == 1 && result[1].length == 0) {
            $('.output_tips').css({ 'display': '' }).siblings().css({ 'display': 'none' })
            $('.output_tips p').html(result[0]);
        } else if (type_flag == -1) {
            $('.output_tips').css({ 'display': '' }).siblings().css({ 'display': 'none' })
            $('.output_tips p').html(`输入框为空`);
        } else {//0
            $('.output_msg').css({ 'display': '' }).siblings().css({ 'display': 'none' })

            // 大写
            var group_list = result[1]
            var group_len = group_list.length
            console.log(group_list)
            var roman_result = ''
            var temp_str = ''
            group_list.forEach((segment) => {
                for (let str_index = group_len; str_index > 0; str_index--) {
                    if (str_index > 2) {
                        temp_str = `<b>${str_index == group_len ? segment : temp_str}</b>`;
                    } else if (str_index == 2) {
                        temp_str = `<span>${group_len > 2 ? temp_str : segment}</span>`;
                    } else if (group_len == 1) {
                        temp_str = segment;
                    }
                }
                roman_result += temp_str
                group_len--
            });

            // 大写
            $('.msg_upper_stand div').html(roman_result);

            // 小写
            $('.msg_lower_stand div').html(roman_result.toLowerCase());

            // 专属大写
            $('.msg_upper_bk div').html(result[0]);

            // 专属小写
            $('.msg_lower_bk div').html(result[0].toLowerCase());
        }
    })
})