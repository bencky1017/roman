!(function () {
    /** BK罗马数字转换
     * 原罗马数字规则
     * 右加左减:：小数在左边用减法，小数在右边用加法，IV=4，VI=6
     * 右三左一:：放在右边的数字可以连续三次，放在左边的只能一个，比如VIII=8，IV=4是可以的，IIV≠3
     * 左不跨级:：不能跨越数量级，表示99时，虽然IC更简单，但是I和C跨越了X，只能用XCIX
     * 不减半级:：左侧仅限I=1，X=10，C=100，45只能XLV，不能VL
     * 次不过三:：同一个字符不能连续超过3次，如4=IV，不能表示为IIII
     * 加线乘千:：字符上加线，表示数值*1000，此处用*表示线，V*=5000，I*等于M，II*非法等于MM，VII*=7000
     * 半级不复:：半个数量级的数字不能重复，V=5，L=50，D=500，表示140只能CXL，不能LLXL
     * 
     * 非法输入:：X*MM=10,000+2,000=12,000，正确应该是XII*,存在*M时候，可以换成I*，*MMM可以换成III*
     */
    // 古罗马数字
    var roman_number = [
        ["I", "V", "X", "L", "C", "D", "M", "*"],
        [1, 5, 10, 50, 100, 500, 1000, '*1000']//前面的数字*1000
    ]

    // 阿拉伯数字
    var arab_number = [
        [1000, "M"],
        [900, "CM"],
        [500, "D"],
        [400, "CD"],
        [100, "C"],
        [90, "XC"],
        [50, "L"],
        [40, "XL"],
        [10, "X"],
        [9, "IX"],
        [5, "V"],
        [4, "IV"],
        [1, "I"],
    ]

    var roman_span = [
        // 跨越半数量级的修正，先计算了加法：XCVIII=>118，改变了XC=90=>110，需要修正-20
        // IV=4——>修正-2
        // IX=9——>修正-2
        // XL=40——>修正-20
        // XC=90——>修正-20
        // CD=400——>修正-200
        // CM=900——>修正-200
        ["IV", "IX", "XL", "XC", "CD", "CM"],
        ["2", "2", "20", "20", "200", "200"]
    ]

    var rule_illegal = [
        ['VV', 'LL', 'DD'],//半级不复
        ['VX', 'VL', 'VC', 'VD', 'VM', 'LC', 'LD', 'LM', 'DM'],//不减半级
        ['IL', 'IC', 'ID', 'IM', 'XD', 'XM'],//左不跨级
        [],//非法输入，左侧比右侧小 
    ]

    var develop_list = []//develop参数为1时候，显示非法提示信息
    var trans = {
        analyse: (roman) => {
            // 校验接收的数据的正确性
            /**
             * 右加左减
             * 右三左一
             * 左不跨级✔️
             * 不减半级✔️
             * 次不过三✔️
             * 加线乘千❌
             * 半级不复✔️
             * 非法输入
             */
            var get_roman = roman.toUpperCase()
            console.log(`罗马数字：${get_roman}`)
            var show_rule_process = 0

            var rule_flag = {
                str_repeat: 0,//次不过三✔️
                half_repeat: 0,//半级不复✔️
                half_minus: 0,//不减半级✔️
                left_over: 0,//左不跨级✔️
            }

            /********************************************************************************
             * 规则判断：次不过三✔️
             * 简化判断：
             * 除了“M”和“*”外，连续字符不可以超过3个
             *******************************************************************************/
            var str_repeat_flag = 0
            switch (str_repeat_flag) {
                case 0:
                    // 方法一：
                    var max_len = 0         //最大长度
                    var max_str = []        //最大长度的字符
                    show_rule_process ? console.log('罗马字符：', get_roman) : 0
                    var regexp = /([\w])\1*/g; // 匹配连续字符的正则表达式,\1表示（）里面的内容
                    var repeat_list = get_roman.match(regexp); // 获取所有连续字符序列
                    repeat_list.forEach(item => {
                        if (item.length > max_len) {
                            max_str = []
                            max_str.push(item[0])
                            max_len = item.length
                        } else if (item.length == max_len) {
                            max_str.push(item[0])
                        }
                    });
                    // M可以重复
                    max_str.length > 1 ? max_str.splice(max_str.indexOf('M'), 1) : 0
                    break;
                default:
                    // 方法二：
                    var str_num = 1         //默认1个字符，不可修改
                    var max_len = 0         //最大长度
                    var max_str = ''        //最大长度的字符
                    var show_process = 1    //显示过程
                    console.log('罗马字符：', get_roman)
                    for (var i in get_roman) {
                        var j = parseInt(i) + 1
                        if (get_roman[j] == get_roman[i]) {
                            str_num++
                            max_str = max_len > str_num ? max_str : get_roman[i]
                        } else {
                            max_len = max_len > str_num ? max_len : str_num
                            show_process ? console.log(parseInt(i), get_roman[i], '统计', '最大长度', max_len, '最大字符', max_str, str_num) : 0
                            str_num = 1
                        }
                    }
                    max_str = max_str == '' ? get_roman.at(-1) : max_str
                    break;
            }
            show_rule_process ? console.log('次不过三', max_len, max_str) : 0
            if (max_len > 3 && max_str != 'M') {
                console.warn(`[Warn] 非法重复次数："${max_str}"重复 ${max_len} 次`)
                develop_list.push(`[Warn] 非法重复次数："${max_str}"重复 ${max_len} 次`)
            } else {
                rule_flag.str_repeat = 1
            }

            /********************************************************************************
             * 规则判断：半级不复✔️
             * 简化判断：
             * 半个数量级的字符：VLD不可以超过两个
             *******************************************************************************/
            var half_repeat_exp = /([VLD])\1{1,}/g;
            var half_repeat_list = get_roman.match(half_repeat_exp)
            half_repeat_list = half_repeat_list ? half_repeat_list : []
            show_rule_process ? console.log('半级不复', half_repeat_list) : 0
            if (half_repeat_list != null && half_repeat_list.length != 0) {
                console.warn(`[Warn] 半级非法重复："${half_repeat_list}"不可重复使用`)
                develop_list.push(`[Warn] 半级非法重复："${half_repeat_list}"不可重复使用`)
            } else {
                rule_flag.half_repeat = 1
            }

            /********************************************************************************
             * 规则判断：不减半级✔️
             * 简化判断：
             * 罗马数字中不可以包含非法数据的指定字符串
             *******************************************************************************/
            var half_rule_list = rule_illegal[1]
            var half_string_list = []
            half_rule_list.forEach(item => {
                if (get_roman.indexOf(item) != -1) {
                    half_string_list.push(item)
                }
            })
            show_rule_process ? console.log('不减半级', half_string_list) : 0
            if (half_string_list.length != 0) {
                console.warn(`[Warn] 非法半级减数："${half_string_list}"不可作为减数`)
                develop_list.push(`[Warn] 非法半级减数："${half_string_list}"不可作为减数`)
            } else {
                rule_flag.half_minus = 1
            }

            /********************************************************************************
             * 规则判断：左不跨级✔️
             * 简化判断：
             * 左侧减法字符与被减字符之间不能跨越数量级
             *******************************************************************************/
            var left_over_list = rule_illegal[2]
            var left_string_list = []
            left_over_list.forEach(item => {
                if (get_roman.indexOf(item) != -1) {
                    left_string_list.push(item)
                }
            })
            show_rule_process ? console.log('左不跨级', left_string_list) : 0
            if (left_string_list.length != 0) {
                console.warn(`[Warn] 非法跨越数量级："${left_string_list}"存在跨级`)
                develop_list.push(`[Warn] 非法跨越数量级："${left_string_list}"存在跨级`)
            } else {
                rule_flag.left_over = 1
            }

            /********************************************************************************
             * 规则判断：加线乘千❌
             * 简化判断：
             * 由于判断受限，未找到合理处理方式
             * 存在*M时候，可以换成I*，*MMM可以换成III*
             *******************************************************************************/


            /********************************************************************************
             * 规则判断：规则统计✔️
             * 简化判断：
             * 将几个规则判断结果统计，不等于规则长度的为未通过
             *******************************************************************************/
            var rule_len = 0
            Object.values(rule_flag).forEach(item => {
                rule_len += item
            })
            show_rule_process ? console.log(`规则标记：${rule_len}`, rule_flag) : 0

            // console.log('######################################################################')
        },
        roman2arab: (roman, develop = 0) => {
            develop_list = []//重置
            var roman_regexp = /[^IVXLCDM*]/g
            if (roman_regexp.test(roman.toUpperCase())) {
                console.error(`[Error] 参数错误："${roman}" 包含非罗马字符`);
                develop_list.push(`[Error] 参数错误："${roman}" 包含非罗马字符`)
                return [arab_number, develop_list]
            } else {
                var get_roman = roman.toUpperCase()
            }
            jx(get_roman)
            // var get_roman = "CXXXIV**CMXLV*DLXXXIV"//134,945,584
            // console.log(roman_number[0].join('\t   '))
            // console.log(roman_number[1].join('\t   '))

            // 阿拉伯数字
            var arab_number = 0     //最终计算、连续*号结束
            var temp_arab = 0       //遇到*号记录
            var temp_sum = 0        //连续字母求和，遇到*号清空
            var show_process = 0    //显示输出过程

            // 循环获取的罗马数字
            for (var i in get_roman) {
                var roman_index = roman_number[0].indexOf(get_roman[i])
                // 是*号
                if (get_roman[i] == roman_number[0].at(-1)) {
                    temp_arab = temp_sum == 0 ? temp_arab * 1000 : temp_sum * 1000
                    temp_sum = 0
                    arab_number += get_roman.length - 1 == i ? temp_arab : 0
                    show_process ? console.log(0, '乘1000：', temp_arab) : 0
                }
                // 是罗马字符
                else {
                    var double_str = i - 1 >= 0 ? get_roman.slice(i - 1, parseInt(i) + 1) : "start"
                    arab_number += temp_sum == 0 ? temp_arab : 0
                    temp_sum += roman_number[1][roman_index]
                    show_process ? console.log('当前', get_roman[i], roman_number[1][roman_index], ' \tsum：', temp_sum) : 0
                    // 修正算法
                    if (roman_span[0].indexOf(double_str) != -1) {
                        temp_sum -= roman_span[1][roman_span[0].indexOf(double_str)]
                        show_process ? console.log(0, '修正-' + roman_span[1][roman_span[0].indexOf(double_str)], double_str, temp_sum) : 0
                    }
                }
            }
            arab_number += temp_sum
            // console.log(arab_number)
            // console.log('######################################################################')
            return develop ? [arab_number, develop_list] : arab_number
        },
        arab2roman: (arab, develop) => {
            var get_arab = 0
            var show_process = 0
            if (isNaN(arab)) {
                console.error(`[Error] 参数错误："${arab}" 非阿拉伯数字`);
                return
            } else {
                // 分位符格式化：1,638,400
                get_arab = Number(arab).toLocaleString()
            }
            // console.clear()
            console.log(`阿拉伯数字：`, get_arab)

            /********************************************************************************
             * 数字分组转换
             * 3999以内四位，没有*号
             * 4000开始有*号
             * 位数取余3，剩余1位，和后3位一起处理
             *******************************************************************************/
            var format_str = get_arab.split(',')
            show_process ? console.log(`分组：`, format_str) : 0
            // 将字符串前两个拼接，首位只允许2,3,4位的数字
            format_str = format_str[0].length == 1 && format_str[0] < 4 ? [format_str.splice(0, 2).join('')].concat(format_str) : format_str
            show_process ? console.log(`合并：`, format_str) : 0

            /********************************************************************************
             * 数字转罗马
             * 将分组数字进行罗马数字转换，并返回列表
             *******************************************************************************/
            var roman_list = []
            format_str.forEach(item => {
                var roman_str = ''
                show_process ? console.log('原始数据：', item, roman_str) : 0
                for (var item_index = 0; item_index < arab_number.length; item_index++) {
                    if (item >= arab_number[item_index][0]) {
                        item -= arab_number[item_index][0];
                        roman_str += arab_number[item_index][1]
                        show_process ? console.log('减去：', arab_number[item_index][0], arab_number[item_index][1]) : 0
                        show_process ? console.log('剩余：', item) : 0
                        //此处的作用是重复判断当前罗马字符是否能够再次匹配
                        item_index--
                    }
                }
                roman_list.push(roman_str)
                show_process ? console.log(roman_list) : 0
            })
            show_process ? console.log(format_str, roman_list) : 0

            /********************************************************************************
             * 星号添加
             * 根据数字分组转换的长度，判断对应位置的星号个数
             * 根据'000'的位置，判断是否需要数据
             *******************************************************************************/
            var roman_len = roman_list.length
            var roman_string = ''
            // for(var roman_item in roman_list){
            //     console.log(roman_item)
            // }
            roman_list.forEach(item => {
                roman_string += item != '' ? item + "*".repeat(roman_len - 1) : ''
                roman_len--
            })
            // console.log(roman_string)
            // console.log('######################################################################')
            return develop ? [roman_string, roman_list] : roman_string
        },
        test: (str = undefined) => {
            if (str == undefined || str == '') {
                for (var i in Object.keys(list)) {
                    jx(Object.keys(list)[i])
                    // console.log(Object.values(list)[i])
                    aaaa = ra(Object.keys(list)[i])
                    if (aaaa != Object.values(list)[i]) {
                        console.log(6666666, "非法")
                    }
                    console.log('######################################################################')
                }
            } else {
                jx(str)
                aaaa = ra(str)
                console.log('######################################################################')
            }
        },
        ttttt: () => {
            // ra("LXVV*D"); // 65500
            // ra("IV*D"); // 4500
            // ra("CXXXIV**CMXLV*DLXXXIV"); // 134,945,584
            // ra("LXV*DDDDXXXVI"); //65,536
            // ra("MMMMDCCCCLLLDVDXDXXXVVXIIIC"); //4888
            // ra("MCMXCVvIII"); //1998
            // ra("X*MM"); //非法12000

            // ra('CLXXXIII*DCL')

            // ar('8365')
            // ra('CLXXXIII*DCL')

            // ar('163840')
            // ra('CLXIII*DCCCXL')

            // ar('16000008000')
            // ra('XVI***VIII*')

            ra('XVI*****VIII*')

            // ar('65259')
            // console.log('LXV*CCLIX')
            // ra('LXV*CCLIX')

            // ar('1638400')
            // console.log('MDCXXXV*MMMCD')
            // ra('MDCXXXV*MMMCD')

            // ra("I"); // 1
            // ra("III"); // 3
            // ra("IIII"); // 非法4
            // ra("IV")//4
            // ra("VI"); // 6
            // ra("IX"); // 9
            // ra("IC"); // 非法99
            // ra("XCIX"); // 99
            // ra("VL"); // 非法
            // ra("IXL"); // 非法
            // ra("XLV"); // 45
            // ra("VLV"); // 非法50
            // ra("LXV*D"); // 65500
            // ra("IV*D"); // 4500
            // ra("CXXXIV**CMXLV*DLXXXIV"); // 134,945,584
            // ra("LXV*DXXXVI"); //65,536
            // ra("MMMMDCCCLXXXVIII"); //4888
            // ra("MCMXCVIII"); //1998
            // ra("III**"); //3000000
            // ra("X*MM"); //非法12000
        }
    }
    window.rn = roman_number
    window.an = arab_number
    window.ra = trans.roman2arab
    window.ar = trans.arab2roman
    window.jx = trans.analyse
    window.test = trans.test
    window.ttttt = trans.ttttt

    // test()
    ttttt()

})()