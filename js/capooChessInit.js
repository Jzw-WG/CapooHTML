const ruleJson = {
    "N0":"大成功！！！",
    "mode0":"挑战成功，请选择其他挑战或再来一把QwQ。",
    "N-1":"游戏结束",
    "mode-1":"挑战失败，请重新开始。",
    "N1":"经典模式",
    "mode1":"尽情的购买和合成，但是只有200块钱。",
    "N2":"快速模式",
    "mode2":"你只有30s的时间合成指定咖啵。",
}
const WIN = 0;
const LOSE = -1;

const time = 30;

var money = 200;

var rule = 2;

var capooCardsInPool = [];

var capooCardsInPreparation = [];

class Capoo {
    constructor(type, level, price) {
        this.type = type;
        this.level = level;
        this.price = price;
    }

    upgrade() {
        this.level++;
        this.price = this.price * 3;
    }
}


var capooCardsInShop = [new Capoo("X",0,0), new Capoo("X",0,0), new Capoo("X",0,0), new Capoo("X",0,0), new Capoo("X",0,0)];

var chessModel = {
    preparationSize: 10,
    shopSize: 5,
    cardsNumPreCapoo: 27,
    capooTypes: 10,
    freshPrice: 2,
    generateShopCapoo: function() {
        let shopLeftCard = [];
        for (let i = 0; i < this.shopSize; i++) {
            // 记录商店剩余卡牌
            if (capooCardsInShop[i].type != "X") {
                shopLeftCard.push(capooCardsInShop[i]);
            }

            let randomCapooIndex = Math.floor(Math.random() * capooCardsInPool.length);
            let randomCapoo = capooCardsInPool.splice(randomCapooIndex, 1);
            capooCardsInShop[i] = randomCapoo[0];
            chessView.displayShopCard(i, randomCapoo[0]);
        }
        // 剩余卡牌归还给卡池
        for (let i = 0; i < shopLeftCard.length; i++) {
            capooCardsInPool.push(shopLeftCard[i]);
        }
    }
}

var chessView = {
    displayPreCard: function() {
        for (let i = 0; i < chessModel.preparationSize; i++) {
            let precard = document.getElementById("preimg_" + i);
            if (capooCardsInPreparation[i]) {
                let type = capooCardsInPreparation[i].type;
                precard.setAttribute("src", "img/chess/" + type + ".gif");
                precard.setAttribute("class", "border" + capooCardsInPreparation[i].level);
            } else {
                precard.setAttribute("src", "img/chess/X.gif");
                precard.setAttribute("class", "border" + 0);
            }
        }
    },
    displayShopCard: function(index, capoo) {
        let shopcard = document.getElementById("shopimg_" + index);
        shopcard.setAttribute("src", "img/chess/" + capoo.type + ".gif");
    },
    displayMoney: function() {
        let m = document.getElementById("moneyvalue");
        m.innerHTML = "金币： " + money;
    },
    displayTime: function() {
        let t = document.getElementById("timeleft");
        t.innerHTML = "剩余时间： " + chessRule.timeleft;
    },
    // displayRuleList: function() {
    //     let ar = document.getElementById("allrules");
    // },
    displayRule: function() {
        let s = document.getElementById("selectrule");
        s.innerHTML = "";
        let r = document.getElementById("ruletitle");
        r.innerHTML = chessRule.getRule(rule);
        let rt = document.getElementById("ruletext");
        rt.innerHTML = chessRule.getRuleText(rule);
        if (rule == 2) {
            let t = document.getElementById("ruletarget");
            t.innerHTML = "目标";
            let ri = document.getElementById("ruleimg");
            let randtarget = Math.floor(Math.random() * chessModel.capooTypes);
            ri.innerHTML = '<img style="vertical-align: middle" src="img/chess/' + randtarget + '.gif">';
            chessRule.initRule2(randtarget);
        }
    },
    displayResult: function(result) {
        if (result == undefined || result == null) {
            return;
        }
        let r = document.getElementById("ruletitle");
        r.innerHTML = chessRule.getRule(result);
        let rt = document.getElementById("ruletext");
        rt.innerHTML = chessRule.getRuleText(result);
        let s = document.getElementById("selectrule");
        s.innerHTML = "重新开始";
    }
}

var chessRule = {
    timeleft: 30,
    timeout: null,
    type: null,
    initRule2: function(type) {
        this.timeleft = time;
        this.type = type;
        chessView.displayTime();
        this.timeout = setInterval(() => {
            this.checkWinOrLose(rule);
            if (this.timeleft > 0) {
                this.timeleft--;
                chessView.displayTime();
            } else {
                clearInterval(this.timeout);
            }
        }, 1000);
    },

    getRule: function(rule) {
        return ruleJson["N" + rule];
    },
    getRuleText: function(rule) {
        return ruleJson["mode" + rule];
    },
    checkWinOrLose: function (rule) {
        let result;
        if (rule == 2) {
            if (this.timeleft <= 0) {
                result = LOSE;
            }
            // TODO:可优化
            for (let i = 0; i < capooCardsInPreparation.length; i++) {
                const card = capooCardsInPreparation[i];
                if (card.level == 3 && card.type == chessRule.type) {
                    result = WIN;
                    clearInterval(chessRule.timeout);
                    break;
                }
            }
        }
        chessView.displayResult(result);
        return result;
    }
}

// 初始化
function chessInit() {
    chessView.displayMoney();
    // chessView.displayRule();
    capooCardsInPreparation = [];
    capooCardsInPool = [];
    // 卡池重置
    for (let i = 0; i < chessModel.capooTypes; i++) {
        for (let j = 0; j < chessModel.cardsNumPreCapoo; j++) {
            capooCardsInPool.push(new Capoo(String(i), 1, 1));
        }
    }
    // 初始化备战席和商店面板
    let preTr = document.getElementById("pretr");
    for (let i = 0; i < chessModel.preparationSize; i++) {
        let preTd = preTr.insertCell(i);
        preTd.setAttribute("id", "pre_" + i);
        preTd.innerHTML = '<img id="preimg_' + i + '" src="img/chess/X.gif" class="border0">';
        preTd.addEventListener("click", 
        function() {
            sell(i);
        }, 
        false);
    }
    let shopTr = document.getElementById("shoptr");
    for (let i = 0; i < chessModel.shopSize; i++) {
        let shopTd = shopTr.insertCell(i);
        shopTd.setAttribute("id", "shop_" + i);
        shopTd.innerHTML = '<img id="shopimg_' + i + '" src="img/chess/X.gif">';
        shopTd.addEventListener("click", 
        function() {
            buy(i);
        }, 
        false);
    }
    // 初始化模式
    let selectRule = document.getElementById("selectrule");
    selectRule.innerHTML = "开始";
    selectRule.addEventListener("click", 
    function() {
        initCards();
        chessModel.generateShopCapoo();
        chessView.displayRule();
    }, 
    false);
    chessModel.generateShopCapoo();
}

function initCards() {
    money = 200;
    capooCardsInPreparation = [];
    capooCardsInPool = [];
    capooCardsInShop = [new Capoo("X",0,0), new Capoo("X",0,0), new Capoo("X",0,0), new Capoo("X",0,0), new Capoo("X",0,0)];
    // 卡池重置
    for (let i = 0; i < chessModel.capooTypes; i++) {
        for (let j = 0; j < chessModel.cardsNumPreCapoo; j++) {
            capooCardsInPool.push(new Capoo(String(i), 1, 1));
        }
    }
    chessView.displayMoney();
    chessView.displayPreCard();
    // chessView.displayShopCard();
}

function sell(index) {
    let card = capooCardsInPreparation[index];
    moneyChange(card.price);
    capooCardsInPreparation.splice(index, 1);

    // 归还卡池
    if (card.level == 1) {
        capooCardsInPool.push(card);
    } else if (card.level == 2) {
        for (let i = 0; i < 3; i++) {
            capooCardsInPool.push(new Capoo(card.type, 1, 1));
        }
    } else if (card.level == 3) {
        for (let i = 0; i < 9; i++) {
            capooCardsInPool.push(new Capoo(card.type, 1, 1));
        }
    } else {
        capooCardsInPool.push(card);
    }
    chessView.displayPreCard();
}

function buy(index) {
    let card = capooCardsInShop[index];
    console.log("buy");
    if (index < 0 || card.type == "X") {
        return;
    }
    let canBuy = checkBuy(card);
    if (canBuy > 0) {
        // 购买点击位置的卡
        moneyChange(-1 * card.price);
        capooCardsInShop[index] = new Capoo("X",0,0);
        chessView.displayShopCard(index, new Capoo("X",0,0));
        capooCardsInPreparation.push(card);
        // 购买剩余同类卡
        let buyWhenFull = 1;
        let i = 0;
        while (canBuy > 1 && buyWhenFull <= canBuy && i < chessModel.shopSize) {
            if (i == index) {
                i++;
                continue;
            }
            console.log(canBuy + "," + buyWhenFull + "," + i);
            if (capooCardsInShop[i].type == card.type) {
                moneyChange(-1 * card.price);
                let cardi = capooCardsInShop[i];
                capooCardsInShop[i] = new Capoo("X",0,0);
                chessView.displayShopCard(i, new Capoo("X",0,0));
                capooCardsInPreparation.push(cardi);
                buyWhenFull++;
            }
            i++;
        }
        chessView.displayPreCard();
        checkAndCombine();
    } else {
        // 增加提示
    }
}

function checkBuy(capoo) {
    if (money < 1) {
        return 0;
    }
    // 备战席是否存在空位
    let hasEmptyInPreparation = capooCardsInPreparation.length < chessModel.preparationSize;
    if (hasEmptyInPreparation) {
        return 1;
    }
    // 备战席满，但是与商店的capoo总和可以合成
    let canCombine = checkCombine(capoo.type);
    let combineWhenFullPreparation = capooCardsInPreparation.length === chessModel.preparationSize && canCombine > 0;
    if (combineWhenFullPreparation) {
        return canCombine;
    }
    return 0;
}

function checkCombine(type) {
    let cardsInPre = capooCardsInPreparation.filter(element => element.type == type && element.level == 1);
    let cardsInShop = capooCardsInShop.filter(element => element.type == type);
    if (cardsInPre.length + cardsInShop.length >= 3) {
        return 3 - cardsInPre.length;
    }
    return 0;
}

function checkAndCombine() {
    let capoo = check();
    console.log("checkAndCombine");
    if (capoo) {
        let firstIndexOfCardToCombine = -1;
        for (let i = 0; i < capooCardsInPreparation.length; i++) {
            let preCard = capooCardsInPreparation[i];
            
            if (preCard.type == capoo.type && preCard.level == capoo.level) {
                // 第一个要合成的卡的位置
                if (firstIndexOfCardToCombine == -1) {
                    firstIndexOfCardToCombine = i;
                    break;
                }
            }

        }
        // 升级并且删除其余两张卡
        capooCardsInPreparation[firstIndexOfCardToCombine].upgrade();
        delPost(capooCardsInPreparation, capoo.level, capoo.type);
        delPost(capooCardsInPreparation, capoo.level, capoo.type);

        chessView.displayPreCard();
        checkAndCombine();
    } else {
        return;
    }
}

// 从后往前删一个
function delPost(array, level, type){
    for (let i = array.length - 1; i >= 0; i--) {
        let capoo = array[i];
        if (capoo.type == type && capoo.level == level){
            array.splice(i, 1);
            return;
        } 
    }
}

// 检查备战席是否可以合成
function check() {
    for (let i = 0; i < capooCardsInPreparation.length; i++) {
        let capoo = capooCardsInPreparation[i];
        let capooList = capooCardsInPreparation.filter(e => e.type == capoo.type && e.level == capoo.level);
        if (capooList.length >= 3) {
            return new Capoo(capoo.type, capoo.level, capoo.price);
        }
    }
    return null;
}

function moneyChange(value) {
    money = money + value;
    chessView.displayMoney();
}

function fresh() {
    console.log("fresh");
    if (money >= chessModel.freshPrice) {
        moneyChange(-1 * chessModel.freshPrice);
        chessModel.generateShopCapoo();
    }
}



window.onload = chessInit;
document.onkeydown = function (e) {
    if (e.key == "d") {
        fresh();
    }
}
