/* 玩法与分支文案。款式是本作设计，不作为传统固定分类。 */
window.ZANHUA_JOURNEY = {
  styles: {
    everyday: {name:'家常错落款',description:'白花清雅，点缀暖黄与红，花簇疏密错落。',wreath:'wreathEveryday',before:'lookEveryday',after:'lookEverydayFinal',flowers:['jasmine','magnolia','chrysanthemum','red','jasmine','magnolia','chrysanthemum','red']},
    festival: {name:'节庆浓艳款',description:'红黄相映，白花穿插，花围更加丰盈。',wreath:'wreathFestival',before:'lookFestival',after:'lookFestivalFinal',flowers:['red','chrysanthemum','magnolia','jasmine','red','chrysanthemum','magnolia','jasmine']}
  },
  hair: [
    {id:'comb',name:'木梳',asset:'toolComb',target:'length',area:'头发旁亮起的位置',verb:'梳顺头发',image:'mirrorLoose'},
    {id:'hair',name:'头发',asset:'toolHair',target:'bun',area:'盘髻处',verb:'收拢挽髻',image:'mirrorSmooth'},
    {id:'tie',name:'发绳',asset:'toolTie',target:'root',area:'髻根',verb:'束稳发髻',image:'mirrorGathered'},
    {id:'fishbone',name:'鱼骨簪',asset:'itemFishbone',target:'pin',area:'插簪处',verb:'插簪固定',image:'mirrorTied'}
  ],
  flowers: {
    jasmine:'素馨花：白色小花，香气清雅，用于花围中的点缀与增香。',
    magnolia:'白兰花：花瓣细长，香气浓郁，穿插在花簇之间。',
    chrysanthemum:'菊花：花瓣层叠，花形饱满，为花围增添层次和暖黄色。',
    red:'红花：本作中的红色花材，用于点缀亮色、丰富花围配色。'
  },
  questions: [
    {
      question:'你今天头上这一圈花花，都是什么花做的呀？',
      options:['全部都是白兰花','用菊花搭配素馨、白兰花、红花','全部是仿真塑料花'],
      branches:[
        {you:'全部都是白兰花。',grandma:'白兰也在里面，不过不止这一种。你看，还有菊花、素馨和红花，今天采的四种花都用上啦。'},
        {you:'用菊花搭配素馨、白兰花、红花一起编的。',grandma:'菊花添暖黄，素馨白兰有清香，红花添亮色，咱们今天采摘的四种花都用上啦。'},
        {you:'全部是仿真塑料花。',grandma:'咱们今天用的都是鲜花。现在也能见到仿真花做的款式，但鲜花的香气，你走近就闻得到。'}
      ]
    },
    {
      question:'蟳埔女是不是只有过节才戴簪花围？',
      options:['只有婚嫁、重大节庆才佩戴','日常出门、劳作也会戴，看个人喜好','只有拍照打卡的时候戴'],
      branches:[
        {you:'只有过节才能戴。',grandma:'节庆会做更热闹的款式，但平日里很多蟳埔阿嬷出门，也会简简单单簪一圈花。'},
        {you:'日常也会戴，不只是节日。',grandma:'平日里出门、忙活，也有人戴着。戴花不只为了给别人看，自己心里也欢喜。'},
        {you:'只有拍照打卡的时候戴。',grandma:'簪花原本是代代相传的日常装扮，不是专门用来拍照的装饰。'}
      ]
    },
    {
      question:'大家常说“今生戴花，来世漂亮”，这句话是什么意思？',
      options:['戴上花，来世就能变成富贵美人','是一句美好的期许，代表热爱生活，接纳自己','这是祈福，戴上就不会遇到风浪'],
      branches:[
        {you:'戴上花，来世就能变成富贵美人。',grandma:'阿嬷觉得呀，不必把它当作来世富贵的许诺。愿自己一生保有爱美之心，也是一份好心愿。'},
        {you:'是一句美好的期许，代表热爱生活，接纳自己。',grandma:'阿嬷觉得呀，这是一句好听的祝愿。把花戴在头上，把日子认真过，忙的时候也记得爱惜自己。'},
        {you:'用来祈求出海平安，避免风浪。',grandma:'戴上花可不能保证不遇风浪。阿嬷更愿意把这句话，当作善待自己、爱美惜美的心愿。'}
      ]
    }
  ]
};
