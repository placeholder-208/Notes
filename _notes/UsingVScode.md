---
title: VScode 使用指南
---
# VScode使用指南
## 一、光标移动与文本删除
### 1.光标
#### 光标移动
每按下一次“←”或“→”方向键，光标按照箭头所示方向移动一个字符；
每按下一次“↑”或“↓”方向键，光标按照箭头所示方向移动一行，并在允许的情况下，保持列位置的不变，仅在光标位于一行末端，目标行字符长度短于当前所在行时，移动光标后，光标位于目标行的末端。
当光标所在行为最新行，或者说最底部的行时，仅按下“↓”方向键，效果与仅按一次“End”键效果一致，移动到本行末尾。
为使说明清晰，特此规定VScode文本编辑器中行与段的定义，编辑器左侧的阿拉伯数字称为段号，段号所指示的段落，从段号所在行始，到下一段号所在行终（不包含下一段号的所在行），每一行则为可视化界面中文字展示的一行。Windows系统下的VSCode中，按下“Home”键，光标移动到所在行的行首，再次按下“Home”键移动到本段段首；按下“End”键，光标移动到所在行的行尾，再次按下“End”键移动到本段段尾。
组合“Ctrl”键使用，效果则变为移动到当前编辑文本的开始和结尾处。
将“←”和“→”方向键组合“Ctrl”键使用，效果则变为每次按下，按照箭头方向移动一个词组的位置，英文中即为彼此间以空格隔开的单词，而中文的一行被视作一个整体，不以标点符号作分组，也就是说，其效果与仅按下“Home”或“End”一致。
在编辑页面按下快捷键Ctrl+G可以打开一个输入框，输入段号并回车即可将光标移动至输入段号段首处,在快速访问栏输入半角:也可使用该功能。
在通过任意方式移动光标位置后，都可以通过Ctrl+U快捷键回退一次光标移动。
#### 文本删除
backspace和delete负责不同方向上的删除功能，仅按下backspace或delete时，则删除光标左侧或右侧的一个字符
backspace为左侧，delete为右侧，组合“Ctrl”键使用，则按前述方向以一个字符组为颗粒度进行删除。
## 二、段操作
### 创建新段
仅按下回车时在光标所在行的下方创建一个与本行缩进格式一致的新段，若光标所在行下仍有属于本段的行，则成为新段所包含的行，即按下回车，出现两个与回车相关的新段，分别是原段，包含光标所在行以下行的新段（若原段光标所在行之后为空白，则该段为空白段）；组合“Ctrl”键使用时，不打断光标所在段的内容，在下方新建一个空白段；组合“Ctrl+Shift”使用时，在光标所在行的上方创建一个与本段缩进格式一致的新段，即使光标所在行上方仍有本段包含的行，这些行并不会被归入新段。
### 段删除
按下快捷键“Ctrl+Shift+K”可以进行整段快捷删除，若此时选中的内容涉及多段，则所有段一并删除。若删除段落下方有不被删除的段落，则光标落至相邻的下方段落；若没有，则落至相邻的上方段落。
### 段剪切和段粘贴
在不选中文本的情况下，按下快捷键Ctrl+X会剪切掉包括回车键在内的所有本段内容，删除后的光标移动逻辑与段删除一致。选中文本的情况下，剪切内容则为选中内容，回车符位于一段的末尾，若标识选中内容的首尾光标未延伸至上一段或下一段，相应的回车符不会被选中。
在对文本进行粘贴时，粘贴内容出现在光标左侧。
### 段移动
若此时未选中文本，按下“Alt+↑/↓”，每次将光标所在段按箭头所示方向交换相邻段的位置，若选中文本，则选中文本涉及的所有段落被视为一段与其他段进行交换。
特别地，若段落被移至花括号内的代码块，则按照代码块缩进格式对移入段落进行缩进。
若再组合上“Shift”键，则可以将选中文本所涉及的所有段（若未选中文本，则默认光标所在段落），在光标所在段落的上方或下方（方向键决定）复制一次选中段落的所有内容，并将光标移至新生成的段落（若按↑则光标落至上方，若按↓，光标落至下方）。
### 符号间（章间）跳转
因为文件中一般以类、函数方法的定义组织具体代码，所以通过快捷键Ctrl+Shift+O展示当前文件所有类或函数的标识符，即可实现普通文章或小说中章节间跳跃的类似结果，在快速访问栏输入@符号亦可，在@符号后添加半角冒号:，即可对标识符进行分类，在不添加:的默认情况下，标识符按照文件从头到尾的顺序排列。
若要扩大标识符的搜索范围，可以使用快捷键Ctrl+T，将会在所有编辑文件中查找标识符，在快速搜索栏输入#符号亦可。
在符号后输入标识符并回车即可实现快速跳转。
### 快捷注释
按下Ctrl+/，VScode会根据当前文件语言自动注释光标所在段，再次按下取消注释。
## 三、辅助功能
### 快速补全
VScode中快速补全分有两种提示方式，分别是intelisense和inlinecompletion，前者是根据输入显示一个备选栏，后者则是根据输入在光标后以灰色显示可能的预期输入。
按下快捷键Ctrl+space可以强制调出intelisense，快捷键呼出忽视json中的定制化关闭，按下Esc则会关闭。
两种提示方式均通过按下Tab接受建议，intelisense为接收备选栏中被选中的方法，而inlinecomletion则为补全灰色方法。
### 方法简介
呼出intelisense的备选栏后，再次按下Ctrl+Space可以显示当前选中方法的一段简短功能介绍，按Esc关闭。
### 参数简介
在编辑传入方法的参数时，可以在方法括号内按下“Ctrl+Shift+Space”，显示一段展示该方法参数格式的帮助文字，按Esc关闭。
### 快速修复
VScode会检查出当前文件代码中可能存在错误和警告的部分，并提供修复建议，按“Ctrl+.”快捷键可以强制调出。
### Renaming（重构）
我们在编写代码的时候往往会出现需要修改已经声明的变量名或方法名，若通过搜索手动修改需要排除前缀相同而误识别的代码，并将正确识别到的逐一修改，重复又耗时，而Renaming功能帮助我们轻松实现修改变量名和方法名的需求，将光标移动到需要修改的标识符处，按下F2,重新输入修改后的标识符，VScode会帮助我们修改所有使用该方法或变量的代码。
除了批量修改调用代码，Renaming功能还能将选中的代码封装成指定类型的函数，只需要在按下F2前选中要封装的代码即可，随后输入的标识符则为新函数的标识符。
### 多光标
鼠标：长按Alt键，并使用鼠标左键点击想要增加光标的位置，即可生成一个新的光标，松开Alt再点击鼠标左键或按Esc后退出多光标状态。
键盘：按下快捷键“Alt+D”可以对选中的文本进行批量查找编辑，每按一次Alt+D都会在相同的文本处增加一个和选中文本与光标相对位置一致的新光标，注意，查找顺序是从文件头部向后查找的。
在选中多段的情况下，可以使用快捷键“Alt+Shift+i”批量在选中段落的末尾生成光标，每个段落一个光标。
### 鼠标悬停
鼠标悬停在变量或函数名上时会出现提示框，Ctrl键获取更详细的信息。
### 多文件跳转
#### 二个或三个同时编辑文件
这种情况下，与Windows的Alt+Tab切换窗口逻辑相同，使用快捷键Ctrl+Tab+（Shift）可以在当前编辑器打开的文件中跳转，当仅有两个正在编辑的文件时，不论是否组合按下Shift，都会将当前编辑页面转移至另一个编辑页面；当有三个正在编辑的文件时，不组合使用Shift，文件跳转仅会发生在当前编辑文件和上一编辑文件，组合使用Shift则会跳转到最近未被编辑过的文件（即除去当前编辑文件和上一编辑文件后剩下的文件）。
#### 更多数量的同时编辑文件
这种情况下建议使用快捷键Ctrl+P打开文件搜索框，输入具体文件的名称以打开编辑页面，所以在平时要规范命名文件名称以方便记忆。
在完整文件名（包括拓展名）后输入：number，按下回车，即可打开目标文件，并将光标移动至:后输入的数字对应的段号的段首。
### 方法声明、引用和实现快速跳转
在存在接口（interface）的编程语言文件中，鼠标悬停在方法名处，按下F12即可快速到达接口处的方法声明；按下Ctrl+F12即可快速跳转至方法的具体实现；按下Shift+F12将打开一个内嵌编辑器页面，显示所有对该方法的调用。
在不存在接口的文件中，F12效果总为跳转至实现处，无论是否组合Ctrl键使用。
### 自定义代码片段(snippet)
通过设置或快速访问栏，选择snippets功能，可以设置选定语言的代码块，每个代码片段具有一个名字（可以认为是比description更简短的代称），由三部分组成，分别是prefix（前缀，触发快速填充自定义代码片段的已输入前缀），body（主体，要填充的自定义代码片段）和description（描述，可选，用来叙述代码片段的功能等），以JSON格式展示，按照预定格式设置完成后，在编写选定语言的文件时，即可通过intelisence快速填充自定义代码块。
body的编写可以使用一些特定的语法以实现更复杂的功能。使用\$可以设置Tab stop，可以称为编辑点，\$后直接跟阿拉伯数字可以指定不同Tab stop的顺序，在插入body后鼠标光标会根据从小到大的顺序依次出现在不同位置的Tab stop，不同编辑点间使用tab进行跳转，可以设置多个阿拉伯数字相同的编辑点，在对其编辑时会自动创建多光标同时编辑。
除了直接跟阿拉伯数字，还可以在\$后跟一个花括号应用更复杂的语法规则，比如在编辑点预先插入占位符（placeholder），如\${1:placeholder}，编辑该位置时，占位符会被默认选中，除写死的字符串外，VScode还提供了与具体编辑状态相关的变量，如\$CurrentYears，\$TM_FILENAME。变量还允许通过正则运算对字符串进行修改以满足更复杂的需求。
也可以在编辑点对多个选项进行选择，语法格式为${1|option1,option2,...|}不同选项间用逗号隔开，|前的阿拉伯数字仍然表示编辑点序号。
## 四、Git
### Git下载与更新
首先，你需要先安装git，Windows系统下可以通过搜索Git官方网站下载可执行程序，也可以通过包管理软件（如scoop），通过命令行下载git。
下载完成git后，要设置本机Windows用户使用的代码提交用户名和网络邮箱。使用如下命令：
git config --global user.name "yourname"
git config --global user.email "youremail@example.com"
其中，参数global指明这些个人信息用于标识所有本地仓库的代码提交。
### init、add与commit
然后，我们在需要git管理的项目中通过终端命令初始化一个本地仓库，在这里以VScode为例，使用VScode打开项目文件夹，使用快捷键Ctrl+`（Esc下的按键）打开VScode内的终端，输入以下命令：
git init
其中，init即initialize的前缀。
之后我们就创建了一个追踪该项目文件变化的git，在该项目文件夹中可以看到一个git文件夹（Windows系统中默认隐藏，需勾选“显示隐藏文件夹”）。
在仅涉及本地仓库时，git由三部分组成，分别是workspace（即我们编辑的本地文件），stage（暂存区，临时存储更改的文件）和respository（本地仓库，保存了我们每次提交的修改以及相关用于作者标记的信息，）。
每次提交（commit）都需要我们先将修改的文件添加到缓存区，使用命令：
git add FilePath
其中FilePath使用相对路径，相对路径的一些简略写法也被git所接收，如添加当前文件夹中的所有文件，使用命令：
git add ./*
再使用如下命令，将stage中的文件commit至repository：
git commit -m "info about this commit"
-m参数要求在其后增加本次commit的必要信息
我们可以使用如下命令查看当前项目的提交记录，在需要时，根据message确定要回退版本的哈希值。
### 借助log与reflog通过reset自由调整repository版本
git log
值得强调的是，git log只能显示repository中commit最新的三次提交，一旦repository中发生过回退，则用于判定最新的时间线只会是从repository初始化到最新回退版本，举例来说，假设自repository初始化后一共发生过5次commit，为了方便指代，按先后顺序标记五次commit分别为第1，2，3，4，5次commit，若此时repository回退到第3次commit，这是再使用git log命令，只会显示第1，2，3次commit，而无法看到第4，5次commit的记录。
git log还可以增加参数--oneline省略某些内容，让每条commit以一行的形式输出hash和message。--graph会通过ASCII字符绘图展示提交情况，从上到下展示从晚到早的commit，--all显示包括远程分支在内的所有分支。
打开项目的.git文件夹编辑config文件，在其中可以使用[alias]来自定义命令别名，按如下格式：
graph = log --all --oneline --graph
\<alias> = \<string of command>
如此使用命令 git graph即可快速绘制commit历史图。
根据哈希值（只用输入能唯一确定commit记录的哈希值前缀即可，git会根据前缀搜索确定commit记录）回退respository中存储（供其他编辑者拉取）的项目文件，使用如下命令：
git reset -hard HashId
其中参数-hard表示本次回退会覆盖掉本地文件，即将workspace中的项目文件一并回退。
也可以根据commit时间线回退，如下述命令：
git reset -hard head^
其中head表示repository中当前的文件版本，每增加一个\^表示向以前再回退一个版本，为避免\^数量过多影响输入效率，也可以通过下述命令实现根据与当前repository版本的相对“距离”回退repository：
git reset -hard head~number
其中number为阿拉伯数字，对应上一条命令中^的数目，注意，number取1时表示当前版本的上一个版本而不是当前版本。
当我们已经回退到一个更旧的版本后，又需要回退到一个相对这个更旧版本更新的版本，这是就不能通过head或git log得到hashid来回退，我们可以使用命令
git reflog
获取我们每次命令的日志，其会包含reset的回退记录，且不会随reset一并回退日志文件，我们就可以根据reflog中相关commit的hashid再使用命令 git reset -hard hashid回退repository。
### 借助status调整stage与workdirectory
使用git status命令根据当前状态的不同提示用户将修改add到stage或将stage中的修改commit到repository，并会给出实现用户预期的命令格式。
当workdirectory中有修改未add到stage中时，使用git status会提示使用git add命令将修改添加到stage中，或使用git restore命令后跟文件相对路径，将workdirectory中未add的修改删除。
在根据上述建议令workdirectory与stage中的修改记录保持一致，即没有相对于当前版本的repository除stage内保存修改以外的修改时，再次使用git status命令，会提示用户使用git commit命令将stage中的修改提交至repository中；或使用git reset head filename，将stage中保存的修改记录清除，此时head没有添加^或~参数，即指repository的当前版本，也可以使用命令 git restore --staged filename将stage中的修改记录删除。
还可以使用 git restore --staged --worktree filename将stage和workdirectory中不同于当前repository的修改一并删除。

### 删除文件
删除文件不同于修改，其重要性是值得加以使用额外命令避免repository中的误删除造成重大损失。
当我们在workdirectory中删除被git追踪（tracked）的文件时，使用git status命令会提示有文件被删除，若我们确定要删除该文件，也需先将改动add到stage中，并使用commit提交至repository，使用命令git rm filename可以快捷地将文件从workdirectory中删除，并将记录add进stage中；若误操作导致workdirectory中文件被删除，可以使用前一小节内所述内容，使用git restore filename恢复被删除的文件；若使用了git rm命令，既可以先清空stage，再恢复workdirectory；也可以通过git restore --staged --worktree filename同时清空缓存区和工作区的删除。
### 分支创建与管理
未创建新分支的情况下，git使用HEAD和master分别追踪当前分支和当前提交。
使用命令git branch \<name\>可以创建新分支，并以你输入的name命名，这时你可以通过命令
git switch \<name\>将工作区切换到由你输入的name指定的分支，之后的commit将有你指定的分支进行追踪，而master仍然指向你在master分支最新的提交。
使用命令git branch可以查看现有分支以及当前所在的分支（分支名前有一星号*标识）。
使用命令git branch -d \<name\>可以删除由你输入的name指定的分支。
使用命令git switch -c \<name\>可以快捷完成分支创建和切换，新分支名称由你输入的name确定。

### 分支合并
在多人协作开发同一个远程仓库时，我们常会遇到需要合并不同人开发工作的情况，在所有开发人员从远程仓库拉取到当时最新的仓库文件后，有人率先提交了自己所增加的代码，其他人此时再想提交自己的代码，就会因为版本落后于远程仓库而无法提交，此时就需要重新拉取最新版本的远程仓库，并将其与本地仓库的内容合并，此时就需要使用命令git merge [source_branch]，将由你输入的source_branch所指定的分支与你当前所在分支进行合并，远程仓库需要需要通过[alias/branch]的形式同时指定仓库名与分支名。若不输入参数，仅使用git merge命令，则与当前追踪的远程分支进行合并。
此时有两种情况，合并的分支中，一个分支的提交记录是另一个分支提交记录的子集，则当前所在分支的指针直接指向两个分支中最新的提交记录，这种合并方式称为fast-forward（快进）。合并后两条分支的commit记录和仓库内容都会保持一致。
另一种情况是，两条分支各自存在独有的commit记录，这时，git会确定两个分支的共同祖先，即两条分支产生提交记录分歧前最新的提交记录，给目标分支创建一条包含合并源分支更改内容的commit记录，源分支仍然指向旧提交记录，而目标分支将指向新生成的合并commit。这种合并方式称为recursive（递归）或3-way merge三方合并。
如果我们想强制使用3-way merge，我们可以使用
git merge --no-ff \<sourcebranch\> -m
其中--no表示禁止，-ff即fast forwar，删去--no参数，本次merge则使用ff方式，由于使用三方合并需要创建一条新的commit，所以需要增加-m参数并附上commit信息，否则会进入vim编辑器要求补充commit message。
使用命令git log即可查看当前分支指针指向快照前几次的commit记录。
以上讨论仅为使用merge合并后commit记录的变化，至于代码合并，常常会产生conflict（冲突），即不同分支对同一处代码进行了不同的修改，这是我们就需要对所在分支进行新的commit以消除冲突，完成合并。
### 撤销合并
如果在分支合并后出现了合并冲突的情况想要回到合并前的状态，撤销所有未提交的更改，可以使用命令git merge --abort（tip:git命令中缩写使用-前导符，参数全称使用--前导符），如果此时部分合并内容已经提交甚至推送，请回退本地repository版本并强制覆盖远程repository。
如果想要保留合并后未冲突的部分，仅放弃发生合并冲突的更改，可以使用git reset --merge，其会将HEAD重置回上一次提交所在的位置，并保留合并分支未发生冲突的合并内容。
### 临时存储
由于stage和workdirectory的修改是基于现有分支的，所以若此时有未被commit的修改，是无法切换分支的。
但实际生产环境中常常需要临时再创建一个分支，将原工作分支的内容暂存起来，这是就需要如下命令
git stash push [-u] [-a] -m
其中可选参数-u表示保存当前未被追踪的文件，-a表示保存所有文件，包括被列入.gitignore中的文件，-m参数与前述命令中该参数的功能一致，用于添加辅助信息。
我们可以创建多个stash，使用命令
git stash list
即可查看当前存储的stash有哪些，并且会给出每个stash的编号，保存时所在的分支名，注释信息。
使用git stash apply即可恢复当前分支保存的stash，若有多个可通过命令
git stash apply stash@{number}
指定stash恢复，其中number是git给每个stash的编号，通过命令git stash list可以查看。
git stash apply不会删除存储的stash，使用命令git stash drop可以删除当前分支保存的stash，同样使用如下命令
git stash drop stash@{number}
可以删除指定stash。
使用命令git stash pop可以快速恢复并删除最新的stash记录，添加参数stash@{number}可以删除指定stash。
### 移植commit
当我们想要将其他分支的某个commit应用到当前分支时，我们可以通过以下命令实现：
git cherry-pick \<commit-hash\>
该命令会在当前分支应用一次由你输入的commit-hash指定的提交。该commit-hash为commit所在分支被记录的哈希值。只要输入能唯一确定commit的哈希值前缀即可，不用全部输入。

### 远程仓库（以GitHub为例）
#### 建立连接
在添加远程仓库前，首先要确定与Github服务器的远程连接方式，以SSH连接为例，首先我们需要在自己的电脑上建立用于SSH连接的密钥，通过命令
ssh-keygen -t ed25519 -C "your_email@example.com"
可以生成用于SSH连接的密钥和公钥，其中以后缀名.pub结尾的文件为公钥文件，用于在连接时交换，私钥文件用于在本地验证身份，一定不能公开，在上述命令中，-t参数后的ed25519指定了密钥加密方式，-C参数后的message用于设定密钥中的相关个人信息。
生成密钥后，来到GitHub页面，点击个人头像，选择settings，进一步点击SSH and GPG keys选项，在新页面中点击SSH keys旁边的New SSH key按键，自己取定SSH key的title，默认令牌类型，使用文本编辑器打开公钥.pub文件，将其中所有内容（包括不同参数间的空格）复制到下方的文本框中，点击Add SSH key。
在账户上添加完成我们设备的SSH公钥后，就可以测试与GitHub的连通性，打开终端，输入以下命令：
ssh -T git@github.com
其中，-T参数表示在本次连接中禁用伪终端，适用于仅测试连接。
一般在首次连接时，会弹出以下警告
The authenticity of host 'github.com (xx.xx.xx.xx)' can't be established.
RSA key fingerprint is xx.xx.xx.xx.xx.
Are you sure you want to continue connecting (yes/no)?
该警告用于提示用户确认本次连接RSA key的fingerprint是否属于Github服务器，而Github的RSA key fingership为uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s
Ed25519的key fingership为+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU
在确定与警告所给fingership一致后，输入yes，一般就会弹出连接成功的提示。
之后我们需要确定远程仓库与本地仓库的对应关系。根据Github上创建新仓库后的提示，我们选择推送已经存在的repository，输入以下命令：
git remote add origin git@github.com:yourusername/remoterepository.git
其中origin是对后续远程仓库的再命名，用于避免每次输入重复的远程仓库名称。无提示则说明远程仓库连接成功。使用命令git remote -v即可查看当前与repository建立连接的远程仓库。
git branch -M master
该命令则是在远程仓库创建名为master的分支，成功创建后无提示。
git push -u origin master
该命令则是将当前本地分支（通过git status可以查看repository当前所处的分支）与远程仓库origin的master分支对应。
#### 基本操作
##### push
在使用git push -u指定推送的远程仓库分支后，使用默认的git push命令即可快捷地将本地仓库内容推送至远程仓库。
##### fetch、merge和pull
当有多人对同一远程仓库操作，我们不能够确定远程仓库内容与本地差异是否会影响本地文件时，可以使用git fetch re_repository命令拉取远程仓库当前内容到本地，并与本地内容作对比，其中re_repository一般填远程仓库别名。
如果我们检查完成，对差异部分没有问题，可以使用git merge source_branch命令将
当我们想要直接拉取远程仓库并将其与本地repository的分支合并时，我们可以使用命令git pull re_repository branch:localbranch
其中re_pository是远程仓库名（一般填本地简称），branch是远程仓库分支名，localbranch为本地分支名，不指定时（不添加:）默认合并到当前所在分支。
建议使用该命令的时候指定远程仓库名和分支，在不输入远程仓库名和分支时，默认拉取并合并当前跟踪的远程仓库和分支。可以使用git remote -v命令查看当前pull和push跟踪的远程仓库分支。
##### 强制覆盖--force
在某些情况下，我们希望用本地repository的内容，覆盖掉远程仓库的内容；或者当本地仓库的内容落后于远程仓库而无法通过git push提交时。我们可以使用如下命令强制替换远程仓库的内容。
git push --force origin branch
其中force参数表示强制覆盖，branch填要覆盖的仓库分支名，origin即我们在本地对远程仓库进行指代的简称。
注意，由于这次覆盖是由本地仓库的内容进行的，所以输入上述命令后，默认需要在vim编辑器中为本次远程commit输入信息以说明本次覆盖的必要性。
在vim编辑器中首先按下i，进入编辑（insert）模式，完成信息输入后，使用Esc退出insert模式，进入command模式，输入:wq保存并退出vim编辑器。完成本次覆盖。
##### clone
当我们想要将某个仓库的内容下载到本地空仓库时，可以使用git clone命令，具体格式如下
git clone git@github.com/\<url\>.git
其中url为仓库标识符，一般由用户名和仓库名组成。
##### rebase
对github commit有基本了解后，初期我们进行push或者多人对同一远程仓库分支进行协作，常常会导致本地仓库落后于远程仓库的版本，使用three way merge合并后，往往会在原远程仓库commit时间线上再添加一条commit时间线用于记录我们在本地进行的commit，这往往会增加commit时间线的复杂度，由此引出我们的本节功能。
rebase用于我们发现本地版本落后，拉取远程仓库，打算合并后push时使用，通过在git pull中添加参数--rebase使用，即
git pull --rebase
其作用相当于更新了远程仓库，让我们的本地commit基于最新的远程仓库（在没有冲突的情况下）进行推送，而不是之前拉取的远程仓库。
我们的本地commit记录会被放在已推送的commit后，使得commit时间线成为一条直线，削去分叉。
但rebase仅限于本地仓库拉取远程仓库还未推送合并commit记录时，一旦已经推送，则远程仓库的commit时间线无法更改。