## Windows系统安装

!!!warning
不要将项目安装到Program Files，System32等文件夹
不要使用管理员权限运行START.BAT
不能够在无法运行NODEJS 20上的Windows7系统安装
!!!

### 通过Git安装

1. 安装NodeJS（推荐最新版本）
2. 安装Windows系统下的Git
3. 使用快捷键Win+E打开文件管理系统
4. 选择或创建一个不被Windows系统监管和控制的文件夹（如C盘上自己创建的MySpecialFolder文件夹）
5. 进入你选择或创建的文件夹，在顶部地址栏输入cmd，按下Enter键，将当前文件夹在cmd中打开
6. 此时将会出现命令行界面（黑色方框），选择以下命令中的一条输入并按下Enter键执行：
   - Release分支: `git clone https://github.com/SillyTavern/SillyTavern -b release`
   - Staging分支: `git clone https://github.com/SillyTavern/SillyTavern -b staging`

7. 进程提示clone结束后，打开文件夹，双击Start.bat文件配置NodeJS环境
8. 脚本文件将会在本地运行服务器，SillyTavern页面也会在浏览器中加载

### 通过SillyTavern Launcher安装

1.  按下快捷键Win+R打开“运行”命令框，然后输入并运行以下命令安装git
    ```shell
    cmd /c winget install -e --id Git.Git
    ```
2. 按下快捷键Win+E打开文件管理器，打开你想要安装SillyTavern Launcher的文件夹。进入预期文件夹后，在顶部地址栏输入cmd并按下Enter键，以当前文件夹作为工作目录打开cmd，输入并运行以下指令。
   ```shell
    git clone https://github.com/SillyTavern/SillyTavern-Launcher.git && cd SillyTavern-Launcher && start installer.bat
    ```

### 通过Github Desktop软件安装
(此种方式下仅能在Github Destop软件中使用git命令，如果你想像上述方式一样在命令行中使用，仍需安装Windows系统下的Git)

1. 安装NodeJS（推荐最新的仍受维护的版本）
2. 安装Github Destop软件
3. 安装完Github Destop软件后,在欢迎页点击 `Clone a repository from the internet....` (注: 当前你并不需要创建一个Github账号)
  
    ![image](/static/windows-1.png)

4. 在新打开的菜单中, 点击URL选项卡, 在Repository URL下方输入框输入 `https://github.com/SillyTavern/SillyTavern`, 通过更改Local Path，您可以自由决定安装SillyTavern项目的位置。

    ![image](/static/windows-2.png)

5. 接下来，打开文件资源管理器，进入到上一步骤中您选择的LocalPath文件夹。默认情况下，仓库被克隆在: `C:\Users\[Your Windows Username]\Documents\GitHub\SillyTavern`，其中Your Windows Username是您在Windows系统下的用户名，并非文件夹的名字。
  
6. 双击start.bat文件。（注：.bat文件后缀名可能被您的操作系统所隐藏，如果这样的话，双击名为Start的文件即可。）

    ![image](/static/windows-3.png)

7. 双击运行start.bat文件后，会出现黑色的命令行界面，SillyTavern将会开始安装运行所需的文件。
  
8. 在安装结束后，如果一切正常运行，命令行界面会出现如下图所示的输出，且您的浏览器会打开SillyTavern标签页，若浏览器没有反应，您可以在浏览器地址栏中键入命令行界面显示的形如http://127.0.0.0:XXXX的网址。

    ![image](/static/windows-4.png)

9. 连接任意受我们支持的大模型API，您就可以开始聊天了。

## Docker 安装

!!!
本篇引导假设您已经安装了Docker，并能够通过命令行进行contariner的安装，且熟悉基本指令。
!!!

### 使用Github Container库

使用已经构建好的image是在Docker中使用SillyTavern最简单快速的方法。你能够从Github Container库中拉取最新的image。

#### 使用Docker Compose（建议方式）

从GitHub Repository中下载docker-compose.yml文件，以文件下载位置所在的文件夹作为工作目录打开命令行，输入并运行以下指令。这将会从GitHub Container库中拉取最新被推送的image并进入一个container，自动创建必要的存储文件夹。

```sh
docker compose up
```

您可以编辑docker-compose.yml文件应用一些自定义设置，以满足您的需要。

- 服务器默认运行端口为8000，您可以通过调整ports部分的设置来改变。
- 如果您想要使用开发分支而不是稳定推送的版本，您可以将image处的标签改为staging。
- 如果您想要使用环境变量调整服务器配置，请阅读“环境变量”页面。

#### Docker命令行界面 (进阶)

为了SillyTavern的正常运行，您必须指定两个目录映射和一个端口映射。在指令中以下位置，替换成您的选择：

##### Container Variables

###### Volume Mappings

- `CONFIG_PATH` - SillyTavern配置文件在您主机上的存储位置。
- `DATA_PATH` - SillyTavern数据文件，包括角色等在您主机上的存储位置。
- `PLUGINS_PATH` - （可选）SillyTavern服务使用的插件在您主机上的存储位置。
- `EXTENSIONS_PATH` - (可选) 全局用户界面拓展在您主机上的存储位置

###### Port Mappings

- `PUBLIC_PORT` - 用于通信所需要暴露的接口。这个映射是必须的，因为您是在虚拟机container之外访问创建的image实例的。如果您没有执行单独的安全措施，请不要在互联网上暴露这个接口。

###### 其他设置

- `SILLYTAVERN_VERSION` - 在本项目的Github仓库GitHub Packages页，您会看到被标签注明版本号的image列表，被贴为“latest”的image将会准时推送当前的更新，使您始终使用当前最新版本。您也可以通过利用“staging”指向两条分支各自的image。

##### 运行container

1. 打开您的命令行
2. 将您想要存储项目配置和数据的文件夹作为工作目录打开，并运行以下命令：

```bash
SILLYTAVERN_VERSION="latest"
PUBLIC_PORT="8000"
CONFIG_PATH="./config"
DATA_PATH="./data"
PLUGINS_PATH="./plugins"
EXTENSIONS_PATH="./extensions"

docker run \
  --name="sillytavern" \
  -p "$PUBLIC_PORT:8000/tcp" \
  -v "$CONFIG_PATH:/home/node/app/config:rw" \
  -v "$DATA_PATH:/home/node/app/data:rw" \
  -v "$EXTENSIONS_PATH:/home/node/app/public/scripts/extensions/third-party:rw" \
  -v "$PLUGINS_PATH:/home/node/app/plugins:rw" \
  ghcr.io/sillytavern/sillytavern:"$SILLYTAVERN_VERSION"
```

!!!tip
默认情况下container将在前端保持运行。如果您想要其转向后端静默运行，可以添加在`docker run`命令中添加`-d`标志位
!!!

### 创建Docker image

!!!info
本节内容假设您在非根用户（非管理员）文件夹中安装了SillyTavern。如果您将项目安装在了根用户文件夹中，您需要运行如下命令获取管理员权限[`sudo`,`doas`,Command Prompt(Administrator)]。
!!!

如果您想要自行构建Docker image，您可以按以下步骤执行。这将帮助您定制image或实现您的开发目标。

#### Linux

1. 通过Docker安装引导文档安装Docker
   !!!danger
   **不要**安装Docker桌面端。
   !!!
2. 遵循文档“Post-Installtion Guide”中的步骤，在Docker中作为非根用户管理Docker。
3. 使用您的包管理软件配置Git。

    - Debian (Ubuntu/Pop! OS/etc.)

        ```sh
        sudo apt install git
        ```

    - Arch Linux (Manjaro/EndeavourOS/etc.)

        ```sh
        sudo pacman -S git
        ```

    - Fedora, Red Hat Enterprise Linux (RHEL), etc.
        ```sh
        sudo dnf install git
        ```

4. 克隆SillyTavern仓库

    - Release (Stable Branch)

        ```sh
        git clone https://github.com/SillyTavern/SillyTavern && cd SillyTavern/docker
        ```

    - Staging (Development Branch)
        ```sh
        git clone https://github.com/SillyTavern/SillyTavern -b staging && cd SillyTavern/docker
        ```

5. 在Docker文件夹中通过运行下述指令执行docker compose。

    ```sh
    docker compose up -d
    ```

6. 打开浏览器并前往[http://localhost:8000]网址页。您应该能在一段时间后看到载入的SillyTavern。

#### Windows

!!!warning 有关Windows上的Docker
在Windows上使用Docker非常复杂。您不仅需要通过开启和关闭Windows系统功能激活Windows有关Linux的子系统，还需要调试您系统的虚拟化功能（Intel VT-d/AMD SVM），而该功能因PC或主板制造商的不同而不同。有时，这些选项可能在某些系统上不存在。

强烈建议您通过我的有关Windows系统的安装引导配置SillyTavern。本节有关如何让项目在Windows Docker上运行的内容只是一个大致的想法。
!!!

1.  通过Docker安装引导文档安装Docker Desktop软件。
2.  安装Windows系统下的Git。
3.  克隆SillyTavern仓库。

    -   Release (Stable Branch)

        ```sh
        git clone https://github.com/SillyTavern/SillyTavern && cd SillyTavern/docker
        ```

    -   Staging (Development Branch)
        ```sh
        git clone https://github.com/SillyTavern/SillyTavern -b staging && cd SillyTavern/docker
        ```

4.  在Docker文件夹中通过运行以下命令执行docker compose。

    ```sh
    docker compose up -d
    ```

5.  打开浏览器，并前往[http://localhost:8000]网址页，您将会在一段时间后看到载入的SillyTavern。

#### macOS

!!!
即便macOS系统与Linux系统相似，但macOS系统不具有Docker Engine。您必须像在Windows系统一样，安装Docker Destop软件。您还需要安装Homebrew来为您的Mac安装Git。本节内容仅是本项目如何在MacOS上安装大致的想法。
!!!

1.  通过Docker安装引导文档安装Docker Destop。
2.  使用Homebrew安装git

    ```sh
    brew install git
    ```

3.  克隆SillyTavern仓库

    -   Release (Stable Branch)

        ```sh
        git clone https://github.com/SillyTavern/SillyTavern && cd SillyTavern/docker
        ```

    -   Staging (Development Branch)
        ```sh
        git clone https://github.com/SillyTavern/SillyTavern -b staging && cd SillyTavern/docker
        ```

4.  在Docker文件夹中通过运行以下命令执行docker compose。

    ```sh
    docker compose up -d
    ```

5.  打开浏览器，并前往[http://localhost:8000]网址页，您将会在一段时间后看到载入的SillyTavern。

### 调试SillyTavern

SillyTavern的配置文件（config.yaml）位于config文件夹内。修改config文件无论是否使用Docker没有区别，不过您可能需要运行nano或一款代码吗编辑器，并使用管理员权限来保存您的修改。

!!!warning
不要忘记在应用您的更改后重启SillyTavern的容器！确保您在Docker文件夹中执行以下命令。

```sh
docker compose restart sillytavern
```

!!!

### 载入用户数据

SillyTavern的数据文件夹存储在`data`之中。回退您的文件非常简单，不过向文件中添加或存储内容可能需要您具有管理员权限。

### 运行服务插件

在Docker中运行像HoYoWiki-Scraper-TS或SillyTavern-Fandom-Scraper的插件与不在Docker中运行没有大的区别，我们可能需要对Docker Compose脚本进行一点修改来实现。

!!! 注
如果您已经在Docker中看到了plugins文件夹，您可以跳过第1-2步。
!!!

1. 使用nano或其他代码编辑器，打开docker-compose.yml文件并在`volumes`处添加下述内容

    ```sh
        volumes:
            - "./config:/home/node/app/config"
            - "./data:/home/node/app/data"
            - "./plugins:/home/node/app/plugins"
    ```

2. 在Docker中创建一个名为plugins的新文件夹
3. 根据您插件的指示安装该插件
4. 使用管理员权限运行nano或者其他代码编辑器，打开`config`文件夹中的config.yaml，并将enableServerPlugins置为true。

    ```sh
    enableServerPlugins: true
    ```

5. 重启Docker container

    ```sh
    docker compose restart sillytavern
    ```

### 非根用户使用模式

默认情况下，container运行在根用户模式下。如果你想要文件被创建在被特定用户所有的挂载文件夹中（举例，避免根用户文件），你可以启用非根用户模式。

#### 选项1：PUID/PGID（推荐）

为你想要运行非根用户的container的UID/GID中配置PUID和PGID环境变量。进入点会更新所需目录的所有权，然后以映射的用户身份运行服务器。

Docker Compose 举例:

```yaml
services:
  sillytavern:
    environment:
      - PUID=1000
      - PGID=1000
```

Docker CLI 举例:

```bash
docker run \
  --name="sillytavern" \
  -e PUID=1000 \
  -e PGID=1000 \
  -p "$PUBLIC_PORT:8000/tcp" \
  -v "$CONFIG_PATH:/home/node/app/config:rw" \
  -v "$DATA_PATH:/home/node/app/data:rw" \
  -v "$EXTENSIONS_PATH:/home/node/app/public/scripts/extensions/third-party:rw" \
  -v "$PLUGINS_PATH:/home/node/app/plugins:rw" \
  ghcr.io/sillytavern/sillytavern:"$SILLYTAVERN_VERSION"
```

### Option 2: Docker `--user` 标志位

你也可以通过Docker的`--user`标志位来指定用户运行容器。在这种情况下，容器不能自动修复权限问题，所以确保您挂载的数据卷运行您提供的UID/GID对应用户可写。

```bash
docker run \
  --name="sillytavern" \
  --user 1000:1000 \
  -p "$PUBLIC_PORT:8000/tcp" \
  -v "$CONFIG_PATH:/home/node/app/config:rw" \
  -v "$DATA_PATH:/home/node/app/data:rw" \
  -v "$EXTENSIONS_PATH:/home/node/app/public/scripts/extensions/third-party:rw" \
  -v "$PLUGINS_PATH:/home/node/app/plugins:rw" \
  ghcr.io/sillytavern/sillytavern:"$SILLYTAVERN_VERSION"
```

### 容器健康状态检查

Docker镜像文件中内置了健康状态检查机制，用于检测SillyTavern服务器的响应能力。这对于编排系统（比如Docker Compose，Kubernetes，或者Doceker Swarm）自检和容器未响应时自动重启很有帮助。

#### 容器健康状态检查是如何运行的？

项目的健康状态检查使用了心跳文件机制：

1. 系统正常运行时，SillyTavern会定时向数据目录中的`heartbeat.json`文件中写入时间戳。
2. 健康状态检查脚本（`src/healthcheck.js`）会判断心跳文件是否存在且在最近进行过更新。
3. 如果心跳文件丢失或太久没有进行过更新（超过两个时间间隔），容器就会被标记为不健康。

#### 调试

!!!warning
健康状态检查脚本不支持通过命令行参数改变其中记录的数据目录。如果您改变了数据目录的默认位置`/home/node/app/data`，确保您通过环境变量`SILLYTAVERN_DATAROOT`恰当地更改健康状态检查脚本中的数据目录。
!!!

健康状态检查脚本被环境变量`SILLYTAVERN_HEARTBEATINTERVAL`（或config.yaml文件中的`heartbeatINterval`）控制。变量值被指定为几秒内心跳被写入的间隔。

- **默认** `0` (不启用)
- **建议** `30`(使用Docker健康状态检查时)

默认情况下`docker-compose.yml`文件中将心跳设置为开启。

```yaml
services:
  sillytavern:
    environment:
      - SILLYTAVERN_HEARTBEATINTERVAL=30
    healthcheck:
      test: ["CMD", "node", "src/healthcheck.js"]
      interval: 30s
      timeout: 10s
      start_period: 20s
      retries: 3
```

#### 检查容器健康状态

您可以通过以下命令检查SillyTavern容器健康状态：

```sh
docker inspect --format='{{.State.Health.Status}}' sillytavern
```

或查看所有容器的健康状态信息

```sh
docker ps
```

`状态`栏将展示`healthy(健康)`,`unhealthy(不健康)`,或`starting(运行)`，并附有系统正常运行时间。

#### 关闭健康状态检查

如果你不需要健康状态检查功能，你可以通过下述步骤关闭它：

1. 将下方代码块中的环境变量设置为`0`:

    ```yaml
    environment:
      - SILLYTAVERN_HEARTBEATINTERVAL=0
    ```

2. 在您的`docker-compose.yml`文件中删除或注释掉`healthcheck`部分的的内容。

### Docker的常见问题

#### 挂载数据卷的SELinux权限问题

Linux的SELinux模块处于启动状态（比如RHEL，CentOS，Fedora等使用Linux内核的系统）可能因为安全策略问题，会阻止容器访问访问挂载的数据卷。这会导致容器在尝试读或写挂载目录时发生权限拒绝错误。

在挂载的数据卷添加后缀`.z`或`.Z`可以解决该问题。这些后缀让Docker将文件重新标记为共享的数据卷。

- 后缀`z`一般用于将挂载数据卷共享至所有容器。
- 后缀`Z`用于将挂载数据卷仅与当前容器共享。

举个例子：

```yaml
# docker-compose.yml
volumes:
  ## Shared volume
  - ./config:/home/node/app/config:z
  ## Private volume
  - ./data:/home/node/app/data:Z
```

#### 被白名单禁止

!!!warning Docker Desktop vs Docker CE
whitelistDockerHosts配置（默认开启）在处理`host.docker.internal`和`gateway.docker.internal`主机名时运转。这些主机名仅能在Docker Destop（Windows/Mac）下获取。如果您使用使用的是Linux系统中的Docker CE，这些主机名不会被处理并自动列入白名单，容器日志将出现类似于下面的错误信息:

```
Failed to resolve whitelist hostname host.docker.internal: getaddrinfo ENOTFOUND host.docker.internal
Failed to resolve whitelist hostname gateway.docker.internal: getaddrinfo ENOTFOUND gateway.docker.internal
```

如果出现这种情况，您需要按照以下步骤手动将Docker网关地址添加白名单。
!!!

1. 执行下述命令获取SillyTavern所在的Docker容器IP地址。

    ```sh
    docker network inspect docker_default
    ```

    您应该会看到与下方示例相似的输出内容。

    ```json
    [
        {
            "Name": "docker_default",
            "IPAM": {
                "Config": [
                    {
                        "Subnet": "172.18.0.0/16",
                        "Gateway": "172.18.0.1"
                    }
                ]
            }
        }
    ]
    ```

    复制"Gateway"：后的地址，并作记录。

2. 使用管理员权限运行一款文本编辑器，前往`config`处打开`config.yaml`.

    在您的编辑器中，下拉到 `whitelist` 部分。您会看到与下方示例近似的内容。

    ```yaml
    whitelist:
        - 127.0.0.1
    ```

    在 _127.0.0.1_ 下方粘贴您原来复制的内容。最终该部分内容应与下方示例相似。

    ```yaml
    whitelist:
        - 127.0.0.1
        - 172.18.0.1
    ```

    保存文件后退出编辑器。

    !!!info
    注意，如果您将Docker网络配置为网桥链接，您需要重复上述步骤添加其他IP地址到白名单中。
    !!!

3. 重启Docker容器应用新的配置。

    ```sh
    docker compose restart sillytavern
    ```

## 如何更新SillyTavern

根据您的系统选择引导，并根据其中的指示更新ST。

!!! 有关安装指导, 请查看[Installation](/Installation/index.md)。

本引导假设您已经安装好ST，并至少运行过一次。
!!!

----

### Linux/Termux or MacOS

请您确定已经通过git安装ST，此时只要在SillyTavern目录使用'git pull'即可。

- 首先，通过`cd SillyTavern`进入正确的文件夹。
- 然后通过`git pull`拉取推送的更新。
- 最后使用`./start.sh` 或 `bash start.sh` 运行ST。

----

### Windows

>首先请尝试运行`UpdataAndStart.bat`，其位于您配置ST时选择的目录下。

如果更新失败了，请继续阅读以下部分。

#### 方法一 - GIT

我们建议用户使用'git'进行安装.因为:

如果您通过`git clone`安装ST, 您更新所需要做的所有事情仅仅是在ST文件夹中打开命令行，并键入 `git pull` 。即便是命令行界面给您提示出错误信息，但您已经安装了Git Destop软件，您可以使用 `Repository` 菜单并选择 `Pull`。

更新就会自动且安全的完成。

##### "我起初通过zip方式安装，但现在想要转到git方式的帮助"

您的选择很明智。

一旦您通过Zip完成了安装，您需要使用git进行一次新的安装。

幸好我们拥有指导您如何通过Git安装的 [文档](/Installation/Windows.md)。

一旦您通过git安装了一个新的ST在不同文件中，请回到本页面并继续进行有关‘Zip更新’的**步骤4**。

#### 方法二 - ZIP

如果您坚持通过zip方式安装，下方是冗长的更新步骤:

1. 下载最新推送的zip文件。
2. 将zip文件解压缩到您ST所在的文件夹中。
3. 重复您系统下的ST安装方式并安装NodeJS需要的环境。

4. 从您旧的ST中复制以下必要(*)定义的文件夹:

    (*) '必要' = "如果您进行了任何定制化内容，与之相关的文件夹"。
    
    ##### >=1.12.0的更新
    
    从旧ST中复制`/data`目录下的所有内容和 `config.yaml` 文件并粘贴到新ST中对应位置。如果您拥有想要保留的服务器拓展(安装时选择install for "All users") ，请复制 `/public/scripts/extensions/third-party` 目录下的所有内容。
    
    #####  旧版本号<1.12.0 到版本号 >1.12.0的更新
    
    1.12.0版本包含了一个自动合并程序。下一步（5.）*仅*在合并被中断或发生错误后进行。

5. 至少运行一次新安装的ST以创建 `/data/default-user` 目录。
6. 将旧ST `/public` 下的'必要'文件转移到新ST下的 `/data/default-user` 。
    
    没有文件需要强制转移，所以只需要转移您所需要的。
    
    **注:不要复制整个PUBLIC文件夹**
    
    这会打断新的配置过程，并阻止新功能的生成。
    
    ```plaintext
    Assets
    Backgrounds
    Characters
    Chats
    Context
    Groups
    Group chats
    Instruct
    movingUI
    KoboldAI Settings
    NovelAI Settings
    OpenAI Settings
    QuickReplies
    TextGen Settings (textgen = ooba)
    Themes
    User Avatars
    Worlds
    User
    settings.json
    secrets.json <---- this one is in the base folder, not /public/
    ```

7. 复制好所有文件夹和文件后，将它们粘贴到新安装的ST文件夹/data/default-user下 (同时secrets.json粘贴到粘贴到根目录下) 。
8. 根据您的操作系统再运行一次ST，祈愿您能够成功。
9. 如果一切正常显示，您可以安全地删除旧的ST文件夹了。

#### 常见更新问题

##### "There are unresolved conflicts in the working directory.""在工作目录中存在未解决的冲突。"

这意味着您更改了远程仓库中已被更改的默认文件(比如设置的预设方案)。

为了修复这个问题，您需要在终端中运行下述命令。请谨慎操作，因为执行结果是毁灭性的。确保您已经对重要内容进行备份。

```bash
git merge --abort
git reset --hard
git pull --rebase --autostash
```

##### 文件更改阻止git pull

- 如果您更改ST系统文件, `git pull` 将不能运行.
- 有时一个更新可能会要求我们更改一个重要文件, 这种情况下可能也会出现该问题。
- 通常是默认预设文件或 `package-lock.json`发生了更改。
- 这种情况下，您可以尝试移动文件到其他文件夹 (或删除被提示改动的文件) ，然后再尝试 `git pull`.
- 另外一种解决方式是使用命令 `git pull --rebase --autostash`。

##### Error: Cannot find module "***" when starting the server 错误：在运行服务器时找不到模块 "**"

- 这意味着ST在运行环境中新添加了一个npm包.
- 运行命令`npm install` 可以修复这个问题. 运行项目提供的Start.bat和start.sh脚本也可以自动解决这个问题。
- 没有效果? 根据您的系统参考下述对应命令移除node_modules文件夹、清除缓存并重新安装依赖。

**Windows**

```bash
rmdir /s /q node_modules
npm cache clean --force
npm install
```

**Unix/Linux**

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Docker

1. Windows系统下打开您的终端并执行命令 `cd SillyTavern/docker`导航至您的docker目录。
2. 执行命令 `docker compose down`删除您的容器。
3. 执行命令 `docker rmi ghcr.io/sillytavern/sillytavern:latest` (如果您使用staging分支，使用`sillytavern:staging`替代命令中的`sillytavern:latest`   )从缓存中删除您的ST镜像文件。
4. 使用命令 `sudo docker compose up -d`重新构建一个容器。

如果一切顺利, docker会开始重新下载镜像文件, 并在一段时间后，新的镜像文件会载入并能被您运行. 如果您遇到任何问题, 请参考本引导下一节内容。

#### 常见更新问题
##### 我是用Docker方式运行ST，但在更新后我的所有数据消失了！

在1.12.0版本，您必须根据文档 [Migration guide for Docker containers](/Installation/Updating/ST-1.12.0-Migration-Guide.md#containerized-docker-installs)的介绍，为新的数据模型更新数据卷映射。

##### 运行Docker指令时提示权限错误

这是一个Linux问题, 表明您的权限设置地并不恰当， 有以下两种方式来规避它:

1. **简单方法**: 如果您的账户拥有sudo权限, 只需要在指令最前方加上前缀 `sudo`即可 (例如: `sudo docker compose down`) 
2. **恰当的方法**: 修复您的权限问题。 具体方法根据您使用的Linux版本不同而不同。 互联网上有很多引导帮助您解决这个问题。

#### 1.12.0 Migration Guide 合并引导

SillyTavern 1.12.0 (代码名 the "Neo Server" 更新) 包含了数个至关重要的会影响您使用的改变。

本节内容将帮您为更新做好准备并提供一些进一步的引导。

##### 数据存储更新

1.12.0 版本改变了ST处理用户数据的方式。

原先， 所有永久存储的数据都和前端部分一起存储在 `/public` 目录中, 这会造成误解，并可能造成程序运行失败， 也会对集装箱化（标准化）和多端应用安装带来挑战。

###### 更改了什么？

所有来自`/public`的永久信息，比如设置和聊天记录（完整列表见下）都被移动到了一个可配置的独立文件夹, 使其独立于网页服务器并可移植。 在需要兼容性时, 例如, 托管拓展, 完整大小角色卡,用户图像上传等，会使用智能的重定向，将自动托管数据目录中的用户文件。

###### 设置一个数据根目录

您可以提供一个绝对或相对（相对于ST仓库目录）路径，通过更改`config.yuaml`文件或在运行服务器时增加`--dataRoot`控制台参数设定数据根目录。

> YAML 文件举例

```yaml
# -- DATA CONFIGURATION --
# Root directory for user data storage
dataRoot: C:\Users\Harry\Documents\ST-Data
```

> Console 举例

```bash
node server.js --dataRoot="/Users/harry/ST-Data"
# OR
npm run start -- --dataRoot="/Users/harry/ST-Data"
```

默认数据根目录为 `./data`, 该路径意味着 `data` 目录位于ST的仓库目录中。

!!!info Note
数据根目录必须是 **完全的绝对路径** or a **完全的相对路径** 。您不能使用像 `~` 或 `%APP_DATA%`之类的路径缩写, 因为这是在shell中处理而不是操作系统。
!!!

##### 融合

###### **IMPORTANT!** 开始前必读

1. **仅您想要将移动数据根目录的默认位置时阅读本节内容，否则跳过该部分内容** 应在拉取更新后第一次运行服务器 _前_ 设置数据根目录。 运行 `npm install` 生成 `config.yaml`文件向其中直接填入新值或通过命令行参数传递。
2. 所有数据将迁移至 `default-user` 账号。阅读下方[Users](#users)章节了解更多。

###### 无容器 (裸机) 安装

你不需要做任何事! 当你运行ST server服务器，一个自动迁移会处理所有事情，它会检测旧的存储格式（通过检查`/public/characters`目录的存在）。

移动完所有文件后，一个自动备份将会创建在 `/backups/_migration/YYYY-MM-DD` 目录下(解析到当前数据中) ,但在迁移前手动创建一个备份是一次良好的练习。

###### 容器化 (Docker) 安装

迁移docker数据卷中的数据需要一点技巧，但相当直接。 While `docker-compose.yml` provided with the repo was updated to reflect the changes, 你可能需要调整成你习惯的工作流或部署方式。

**Step 1.** 创建一个新的数据卷, 并将它挂载到容器中 "/home/node/app/data" 路径下。 不要移除 `config` 数据卷。

```yaml
volumes:
    - "./config:/home/node/app/config"
    - "./data:/home/node/app/data"
```

**Step 2.** 将`config`数据卷中除`config.yaml`文件外的其余文件移动到新增加的`data`数据卷`default-user`子目录下。

**Step 3.** 重新构建容器并开始运行。

!!!info Note
在 `/public` 目录与 `config` 数据卷间的软链接不再被需要，同时其也没有被构建进新的容器中！
!!!

###### 迁移了什么？

以下文件和目录受本次数据迁移影响。假设为未更改的默认设置，这些文件原本路径与新路径见下表。

| Before                                 | After                                |
|----------------------------------------|--------------------------------------|
| /secrets.json                          | /data/default-user/secrets.json      |
| /thumbnails                            | /data/default-user/thumbnails        |
| /vectors                               | /data/default-user/vectors           |
| /public/settings.json                  | /data/default-user/settings.json     |
| /public/stats.json                     | /data/default-user/stats.json        |
| /public/assets                         | /data/default-user/assets            |
| /public/backgrounds                    | /data/default-user/backgrounds       |
| /public/characters                     | /data/default-user/characters        |
| /public/chats                          | /data/default-user/chats             |
| /public/context                        | /data/default-user/context           |
| /public/scripts/extensions/third-party | /data/default-user/extensions        |
| /public/group chats                    | /data/default-user/group chats       |
| /public/groups                         | /data/default-user/groups            |
| /public/instruct                       | /data/default-user/instruct          |
| /public/KoboldAI Settings              | /data/default-user/KoboldAI Settings |
| /public/movingUI                       | /data/default-user/movingUI          |
| /public/NovelAI Settings               | /data/default-user/NovelAI Settings  |
| /public/OpenAI Settings                | /data/default-user/OpenAI Settings   |
| /public/QuickReplies                   | /data/default-user/QuickReplies      |
| /public/TextGen Settings               | /data/default-user/TextGen Settings  |
| /public/themes                         | /data/default-user/themes            |
| /public/worlds                         | /data/default-user/worlds            |
| /default/content/content.log           | /data/default-user/content.log       |

#### 多用户

1.12.0 添加了一个功能（完全可选），在一台服务器上创建多用户的配置，允许多个用户同时使用他们彼此分离的SillyTavern实例。用户账号也可以通过密码保护增加一层隐私保护。

请参考文档 [Users(多用户)](/Administration/multi-user.md) 了解更多。