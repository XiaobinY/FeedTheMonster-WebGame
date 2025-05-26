from flask import Flask, jsonify, request 
import random
import logging

app = Flask(__name__)

# Sample data (replace with your actual data source, e.g., a database or file)
LESSON_WORDS = {
    "1": ["大人", "小人", "大哭", "大口", "大笑", "小口"],
    "2": ["爸爸", "妈妈", "上天", "天上", "太大", "太小", "一天", "一月", "二天", "二月", "上上下下"],
    "3": ["天地", "大地", "太阳", "月亮", "星星", "天亮", "大火", "大水", "火星", "水星", "三天", "三月", "下地", "地上", "地下"],
    "4": ["土地", "大山", "小山", "土山", "石山", "火山", "土星", "木星", "好人", "田地", "水田", "我有", "我爸", "我妈", "我哭", "我笑"],
    "5": ["大牛", "小牛", "水牛", "山羊", "小羊", "小心", "中心", "心中", "四月", "四天"],
    "6": ["聪明", "明亮", "明天", "明月", "眉头", "鼻头", "石头", "木头", "心头", "小手", "小花", "大树", "小树", "树木", "五月", "五天", "手心"],
    "7": ["花草", "小草", "草地", "树叶", "一日", "大风", "大雨", "小雨", "下雨", "风雨", "雨水", "我的", "六月", "六日", "六天"],
    "8": ["白云", "白天", "明白", "红花", "红日", "火红", "火花", "是的", "我是", "大家", "我家", "人家", "孩子", "鼻子", "叶子", "七月", "七日", "七天", "红太阳"],
    "9": ["爷爷", "奶奶", "多少", "唱歌", "爱笑", "爱哭", "爱唱", "不爱", "不哭", "不笑", "不唱", "是不是", "不是", "好不好", "不好", "八月", "八日", "八天"],
    "10": ["宝宝", "在家", "不在", "游水", "朋友", "友人", "花儿", "儿子", "歌儿", "儿歌", "九月", "九日", "九天"],
    "复习一": ["宝贝", "生人", "生水", "学习", "上学", "看书", "看戏", "游戏", "生字", "生气", "气人", "十月", "十日", "十天", "好孩子", "小朋友", "下雨天", "好朋友", "小人书", "小学生", "中学生", "大学生", "唱儿歌", "小红花"],
    "11": ["看见", "会见", "学会", "早上", "大雪", "小雪", "雪花", "白雪", "雪人", "雪山", "雪地", "下雪天", "小鸡", "大鸡", "绿草", "绿叶", "黄花", "黄牛", "青草"],
    "12": ["小鱼", "飞鸟", "飞跑", "飞人", "不要", "不吃", "爱吃", "小鸟", "黄鸟", "做游戏", "要不要"],
    "13": ["我们", "他们", "人们", "孩子们", "朋友们", "学生们", "春季", "春天", "春风", "春雨", "夏季", "夏天", "三个人", "都不是", "秋季", "秋天", "秋风", "冬季", "冬天", "四季", "都是"],
    "14": ["大狗", "小狗", "黄狗", "黑狗", "大猫", "小猫", "花猫", "白猫", "蓝天", "蓝猫", "落下", "落叶", "真是", "真的", "真心", "天真", "开心", "开会", "开花", "开门", "也要", "也是", "也不要", "也不是"],
    "15": ["大马", "小马", "白马", "黑马", "大米", "小米", "白米", "黑米", "哥哥", "大哥", "姐姐", "大姐", "小姐", "黑天", "天黑", "出来", "出去"],
    "16": ["跳着", "吃着", "看着", "说着", "来了", "去了", "吃了", "你们", "又要", "又去", "又哭", "又说", "又笑", "弟弟", "小弟", "姐妹", "妹妹", "小妹"],
    "17": ["就是", "还是", "还有", "得了", "得到", "来到", "去到", "到了", "东西", "东风", "快乐", "起来", "一起"],
    "18": ["游玩", "玩球", "玩水", "玩游戏", "大球", "气球", "很好", "很大", "很小", "高大", "高山", "高个子", "跳高", "小鸭子", "哈哈笑"],
    "19": ["地方", "上方", "爬山", "爬树", "高兴", "方向", "向着", "捉迷藏", "对着", "对了", "不对", "对不对", "大叫", "叫着", "不能", "对不起", "能不能"],
    "20": ["变了", "不变", "变成", "问好", "问人", "再见", "再说", "再去", "再来", "急得", "着急", "大门", "开门", "门口", "一只", "三只"],
    "复习三": ["回家", "回来", "回去", "回头", "公公", "公鸡", "打人", "白兔", "兔子", "过来", "过去", "来过", "去过", "好吗", "去吗", "来吗", "游泳", "很高兴", "真快乐", "好开心", "好得很", "对不起", "笑哈哈", "一会儿"]
}


sentences = [
    "你好！今天我们一起学习。",
    "谢谢你的帮助！",
    "再见，明天见！",
    "学习很有趣。",
    "我们一起玩游戏吧！"
]

logging.basicConfig(level=logging.INFO)  # Set the desired logging level

@app.route('/api/words', methods=['GET'])
def get_words():
    """Returns a random Chinese word from selected lessons."""
    lessons = request.args.getlist('lesson')  # Get list of lessons from query parameters
    count = request.args.get('count', default=1, type=int)  # Get the number of words to return

    logging.info(f"Requested lessons: {lessons}, count: {count}")

    if not lessons:
        lessons = LESSON_WORDS.keys()

    all_words = []
    for lesson, words in LESSON_WORDS.items():
        if lesson in lessons:
            all_words.extend(words)

    if not all_words:
        return jsonify({'error': 'No words found for the specified lessons'}), 404

    if count > len(all_words):
        return jsonify({'error': f'Not enough words available. Requested {count}, but only {len(all_words)} are available.'}), 400

    if count == 0:
        words = all_words
    else:
        words = random.sample(all_words, count)  # Select 'count' random words without replacement
    return jsonify({'words': words})


@app.route('/api/sentence', methods=['GET'])
def get_sentence():
    """Returns a random Chinese sentence."""
    sentence = random.choice(sentences)
    return jsonify({'sentence': sentence})

if __name__ == '__main__':
    # For local testing only.  In Cloud Run, Gunicorn will handle this.
    app.run(debug=True, host='0.0.0.0', port=8080)
