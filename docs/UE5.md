# UE5

<script src="https://gist.github.com/imzlp/1bb948d5361b68e6856fa2de9ad45a31.js"></script>

初步上手UE5，我写了篇文章：[UE5：新一代虚幻引擎初探](https://imzlp.com/posts/8724/)，已发布的UE5资料和分析内容会放到这篇文章中。

UE5第一个预览版终于要来了，2021.05.26晚10点开启抢先预览！[虚幻引擎5——将于中国时间5月26日周三晚10点开启抢先体验计划！](https://mp.weixin.qq.com/s/W0e79uhqOyxLKXeC9MwnDg)

![image-20210525141457788](https://img.imzlp.com/imgs/zlp/picgo/2021/image-20210525141457788.png)

附之前Epic中国直播的UE开发路线图视频：

- [[中文直播]第29期｜解析虚幻引擎开发路线图(上集) | Epic 王祢 马骥 孙丹璐](https://www.bilibili.com/video/BV1wA411H7h3)
- [[中文直播]第29期｜解析虚幻引擎开发路线图(下集) | Epic 王祢 马骥 孙丹璐](https://www.bilibili.com/video/BV1iK411P7QD)

## Oodle Compression
![](https://img.imzlp.com/imgs/zlp/blog/notes/ue5/index/oodle.png)

和我当初预想的一样，2021.04.01的Feeds：Epic把Oold集成到UE4.27和UE5中了。
- [Oodle now free to use in Unreal Engine via GitHub](https://www.unrealengine.com/en-US/blog/oodle-now-free-to-use-in-unreal-engine-via-github)
- [RAD Game Tools’ Oodle—cross-platform data compression solutions](https://forums.unrealengine.com/development-discussion/rendering/1876442-rad-game-tools%E2%80%99-oodle%E2%80%94cross-platform-data-compression-solutions)

他们会提供四种Oodle系列的压缩算法：
- Oodle Data Compression：最快和最高压缩比的压缩算法，可以用于数据压缩、打包压缩等。
- Oodle Texture：用来压缩Texture，可以压缩BC1-BC7Texture，能够减少50%的Texture大小（官方数据）。
- Oodle Network Compression：压缩TCP/UDP数据，降低与服务器传输占用的带宽。
- Oodle Lossless Image Compression：无损图像压缩算法，比png小很多且具有非常高的解压速度。

目前（2021.04.05）可以拉取UE的`master`分支，下载依赖之后在以下目录下：

```txt
E:\UnrealEngine\Source\UnrealEngine\Engine\Plugins\Compression
E:\UnrealEngine\Source\UnrealEngine\Engine\Plugins\Developer\TextureFormatOodle
```
具有`OodleData`和`OodleNetwork`、`TextureFormatOodle`三个插件，注意必须要下载依赖。不然代码中只有`.h`接口，并没有各个平台的链接库。

比较遗憾的是在更早的引擎版本中不支持，我从UE的开发分支把这部分代码抽离了出来，放到了单独的仓库中：[oodle-compression](https://github.com/hxhb/oodle-compression)，看了代码并没有依赖新版本引擎相关的东西，但是直接在低版本引擎启用会有编译错误，我已修复。插件中的实现也是通过SDK把Oodle添加到了UE的Compression的Modular Feature中，同样可以按照我之前这篇文章的介绍中的方法使用：[ModularFeature：为UE4集成ZSTD压缩算法](https://imzlp.com/posts/8470/)。

>注意：默认打包时启用Oodle需要给UnrealPak添加OodleData的插件依赖，这需要重新编译UnrealPak。

通过传递给UnrealPak命令行参数`-compressionformats=Oodle`来指定Oodle，以及`-compresslevel=Leviathan`来指定压缩级别，经过测试，一个使用zlib压缩之后有295M的pak文件使用Oodle压缩降低到了282M，但是Oodle的解压速度完胜zlib。

Oodle的压缩性能在RAD网站上有对比数据：[Oodle Compression](http://www.radgametools.com/oodle.htm)

![](https://img.imzlp.com/imgs/zlp/blog/notes/ue5/index/oodle_typical_vbar.webp)
![](https://img.imzlp.com/imgs/zlp/blog/notes/ue5/index/oodle260_typical_combined.webp)

其他的对比数据：
- [PS4 Battle : LZ4 vs LZSSE vs Oodle](https://cbloomrants.blogspot.com/2016/05/ps4-battle-lz4-vs-lzsse-vs-oodle.html)

压缩算法的选择就是要在压缩率/解压速度上来做一个权衡，就是压缩率最低的`Selkie`也比zlib要强一点点，但是decompress速度比zlib高了十几倍，对于游戏而言解压速度非常直观地影响到游戏性能，这应该也是UE选择收购RAD的原因吧。

其他资料：
- [How Oodle Kraken and Oodle Texture supercharge the IO system of the Sony PS5](https://cbloomrants.blogspot.com/2020/09/how-oodle-kraken-and-oodle-texture.html)
- [cbloom rants](https://cbloomrants.blogspot.com/)
- [Oodle Texture compression](https://encode.su/threads/3426-Oodle-Texture-compression)
- [PS5 IO System to Be ‘Supercharged’ by Oodle Texture, Bandwidth Goes Up to 17.38GB/s](https://wccftech.com/ps5-io-system-to-be-supercharged-by-oodle-texture-bandwidth-goes-up-to-17-38gb-s/)

## Epic Verse 语法介绍
认真看了一下[Inside Unreal:2020 Year In Review](https://www.twitch.tv/videos/840713360?t=1h6m20s)里展示的Epic Verse代码，看起来新的脚本语言很像`pascal`和`Python`的结合体，而且还有点ruby味，Verse具有静态类型，某些语法与[SkookumScript](https://skookumscript.com/docs/v3.0/#ojb-id-potential-reference)非常像。

2019年初Epic收购了[Agog Labs (and SkookumScript)](https://skookumscript.com/blog/2019/01-23-epic-aquires-agog/)，应该是要来打造UE5的脚本语言，所以UE5的语法结构和SkookumScript比较像应该是比较合理的，根据视频里的展示情况，我认为UE5的脚本语言应该就是Agog Labs做的。

但是这场展示中并没有展示该脚本语言如何与引擎进行交互，也没有展示引擎中的符号信息，与C++的交互方式目前只能观望。目前介绍一下视频里有展示的语言内容。

视频展示的代码如下：

![](https://img.imzlp.com/imgs/zlp/picgo/2020/0.webp)
![](https://img.imzlp.com/imgs/zlp/picgo/2020/1.webp)
![](https://img.imzlp.com/imgs/zlp/picgo/2020/2.webp)
![](https://img.imzlp.com/imgs/zlp/picgo/2020/3.webp)

手敲了遍文本：

```python
# This is a BoxFight prototype game.
BoxFight=class(FortGameScriptBase):
    GameStarted^: bool=false 
    GameEnded^: bool=false 
    CurrentRound^: int=0
    RunGame()
        # Pause until all players in the matchmaking session
        # have connected to the server.
        MaitForPlayersToJoin()

        # Start the game.
        GameStarted := true 
        for(i = 1..NumberofRounds):

            # Perform round setup.
            currentRound := i
            EnableBarriers()
            SetBuildingDisallowed()
            if(!SetupPlayersAndSpawnPoints()?):

                # We hit an error and are unable to start the round.
                ShutdownGame()
                return

            else:
                # Begin the round start countdown.
                Players.PutAllInStasisAllowEmotes()
                Players.SetAllInvulnerable(true)
                SimpleUI.ShowcountDown(7)
                Wait(2)

                # Enable building at the end of the countdown.
                SimpleUI.ShowMessage("Building Enabled")
                SetBuildingAllowed()
                Players.RemoveAllFromStasis()
                Players.SetAllInRound()
                # Wait for the start countdown to complete.
                Wait(4.7)
                SimpleUI.HideMessage()
                # Begin combat and initialize the storm.

                Players.SetAllInvulnerable(false)
                DisableBarriers()

                # Hide the round start after it's had a second to display.
                Wait(1.3)
                simpleUI.HideCountDown()
                Storm.Startstorm(60.0, CurrentRound^)

                #Wait for the round end conditions 
                if(IsSoloGame()?):
                    race:
                        #Setup Solo specific end conditions for testing
                        WaitForZeroRemaining()
                        WaitForRoundTimeout()
                else:
                    race:
                        # Setup Solo specific end conditions for testing
                        WaitForOneRemaining()
                        WaitForZeroRemaining()
                        WaitForRoundTimeout()
                
                # Handle round complete.
                # Give everyone a quick completion message.
                SimpleUI.ShowMessage("Round Complete")
                Wait(2.0)

                # Disable combat and the storm.
                SimpleUI.HideMessage()
                Players.PutAllInstasisAllowEmotes()
                Players.SetAllInvulnerable(true)
                SetBuildingDisallowed()
                Storm.stopstorm()
                Players.SetAllEndRound()
                
                # Display the scoreboard.
```

### class定义
首先是class定义（暂且标记为继承形式）：

```cpp
BoxFight = class(FortGameScriptBase):
```

### 变量声明

> 具有静态类型，并且无需`;`

```cpp
GameStarted^: bool = false
CurrentRound^: int = 0
```

### 变量赋值

> 类似与`pascal`语言（SkookumScript也是如此）

```cpp
GameStarted := 1
```

### 代码块
类似于Python的缩进，需要使用`:`标识：

```cpp
if(!SetupPlayerAndSpwanPoints()?):
	ShutdownGame()
	return
else:
	Players.PutAllInStasisAllowEmotes()
	Players.SetAllInvulnerable(true)
	SimpleUI.ShowcountDown(7)
	Wait(2)
```

`?`在SkookumScript是谓词，只能够应用到`boolean`的对象。在SkookumScript的文档中介绍是可选的，用于标识返回值为布尔类型：

>Optional ‘?’ used as convention to indicate predicate variable or method of return type Boolean (true or false). 

### 循环语句
整型迭代：

```cpp
for(i = 1..NumberOfRounds):
```
这个形式有点类似于ruby语言里的for：

```ruby
for i in 0..100 do
```

### 函数调用
使用`.`来调用成员函数：

```cpp
Players.SetAllInRound()
```

### 具有类似协程的形式

```cpp
if(IsSoloGame()?):
	race:
		WaitForZeroRemaining()
		WairForRoundTimeout()
else:
	race:
		WaitForOntRemaining()
		WaitForZeroRemaining()
		WaitForRoundTimeout()
```
这里代码的含义上类似于UE的行为树中的`Sequences`的节点，只有当它的所有子节点都执行成功（完毕）了，它才执行成功。

这门脚本语言看起来更像是以[SkookumScript](https://skookumscript.com/docs/v3.0/#ojb-id-potential-reference)为基础，糅合了数种编程语言的集合体，目前展示的代码还太少，不好说具体的上手表现怎么样，持续关注。

## Epic收购RAD Game Tools
Epic收购了RAD Game Tools，又开启了买买买模式，Fortnite使用的Oodle压缩算法就是这家做的。
- [Gaming Software Pioneer RAD Game Tools Now Part of Epic Games](https://www.epicgames.com/site/en-US/news/epic-acquires-rad-game-tools)
- [RAD Game Tools](http://www.radgametools.com/)

大概看了下这家做的东西，内容挺多的涵盖了，视频解码、压缩算法、Profile、美术资源处理、音频工具等等，对完善UE的工具链生态是个好事。

我觉得对于Epic而言，收购它目前比较重要的是得到压缩相关的技术积累，这一点对UE5格外重要，因为UE5可以直接使用影视级别的素材资源，资源的大小和相对应的加载时间会成为瓶颈（我认为这也是UE5的首发演示是在PS5上的主要原因），所以需要针对UE5进行定制化的资源压缩方案。希望UE5在2021年的第一季度末尾能顺利出beta版本，不要跳票。


## UE5可能的脚本语言
在Epic的[Inside Unreal:2020 Year In Review](https://www.twitch.tv/videos/840713360?t=1h6m20s)中介绍了一个全新的脚本语言，有可能被称作`Epic Verse`。

reddit上关于该脚本语言的讨论：[Epic showed off their new Unreal Verse scripting language that will probably end up in UE5](https://www.reddit.com/r/unrealengine/comments/kf8z27/epic_showed_off_their_new_unreal_verse_scripting/)

UE4的蓝图极大地降低了非专业开发者的上手门槛，图形化编程的方式从线性角度很容易理解，但是也会造成混乱。上了一定规模的项目还是需要文本化的脚本语言的，主要解决以下几个问题：
1. 文本化方便协同开发，不会造成资源的冲突（BP是资源）
2. 方便直观地进行diff
3. 方便迁移引擎版本，而没有资源的升/降级问题

而且我认为，脚本语言最好是强类型语言，写惯了C++这种静态强类型语言，其实对Lua这种弱类型语言还是挺不习惯的，之前有一种语言叫做[AngelScript](https://www.angelcode.com/)的静态强类型脚本语言，和C++非常像，被第三方集成到了UE中，但是目前只支持PC和主机平台，不支持移动端。

对于UE4中目前在手游开发中主流的脚本语言支持，为腾讯开源的[UnLua]()和[SLua]()两款插件，都是以反射形式集成的，有一些实现上的缺点和社区支持不够，希望Epic能出一款官方支持的脚本工具，原本以为Python有比较大的可能，因为UE在编辑器下对Python的支持已经挺好了，而且Python有比较大的用户群体，上手难度也不高。

如果引入一门新的脚本语言，在UE中可以使用的编程方式：
1. C++
2. 蓝图
3. Python（编辑器）
4. Epic Verse

处理不同的需求有不同的语言，有些过于复杂了。

目前还不知道UE出的这个新脚本具体表现和语法形式怎么样，其实新增一门语言大大增加了用户的学习成本，也不知道UE是如何设计BP和新脚本语言的关联的，等最新的消息再看。

两年前Tim在Reddit上有一些相关的回复和讨论：[It seems people at Epic are considering adding some intermediate script language between C++ and Blueprints](https://www.reddit.com/r/unrealengine/comments/aezhdv/it_seems_people_at_epic_are_considering_adding/edxha25/)

## UE5的PS5真机视频

Epic发布的UE5的PS5的真机视频：
[![](https://img.imzlp.com/imgs/zlp/picgo/2020/20201222102108.png)](https://www.bilibili.com/video/BV1BK411W75W?from=search&seid=15995162156836004073)

Epic Feeds里的介绍：[A first look at Unreal Engine 5](https://www.unrealengine.com/en-US/blog/a-first-look-at-unreal-engine-5)

在UE5中最大的变化应该是引入了`Lumen`和`Nanite`这两个核心的渲染技术，看视频里的效果十分的棒，不知道真是发布时对移动端支持怎么样。

对两项技术进行讨论和分析的文章:
- [Inside Unreal Engine 5: how Epic delivers its generational leap](https://www.eurogamer.net/articles/digitalfoundry-2020-unreal-engine-5-playstation-5-tech-demo-analysis)
- [Lumen in the Land of Nanite: What the Unreal Engine 5 Demo Tells Us About the Future of Video Game Graphics](https://news.itmo.ru/en/startups_and_business/innovations/news/9473/)

对于目前UE4的项目，在文章中有介绍Epic正在开发UE5的前向兼容，使UE4项目能够升级到UE5中，从这个角度来看，UE5的升级也不是完全推翻式的重构，我理解为在UE4基础上更新的一个大版本。

>We’re designing for forward compatibility, so you can get started with next-gen development now in UE4 and move your projects to UE5 when ready. 

预计UE5将在2021年初发布预览版，在年底发布正式版，希望不会跳票，Epic NB!
