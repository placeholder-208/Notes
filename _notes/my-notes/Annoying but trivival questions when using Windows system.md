---
title: Annoy but trivival questions when using Windows system
---

# 使用Windows系统时令人烦躁且琐碎的问题

## 前言
本文用来记录那些在普通用户使用Windows系统时经常遇到的烦人且琐碎的问题，在初期收集的问题和解决方案较少的时候，章节按照一个问题一个章节编排，在后续收录问题变得足够多时，章节按照一类问题一个章节进行组织。

## 系统设置应用管理中仍显示已卸载应用

### 发生原因

这种情况常常由直接删除应用所在文件夹引起，因为能够在应用管理中显示，说明该应用在安装的时候写入了注册表，而直接删除应用所在文件夹，不调用应用自带的卸载程序，导致了注册表未删除而残留。

### 解决方法

- 首先，使用快捷键Win+R打开进程程序，并输入regedit，打开注册表编辑器
- 然后，按照以下路径
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall
打开Uninstall文件夹
- 寻找残留的应用命名的文件夹并删除，即可不再令其在应用管理中显示

### 通识计算机知识

#### 注册表(编辑器)

注册表是Windows系统中树状形式组织，键值对一一对应存储操作系统、硬件设备和应用程序的配置信息等数据的数据库。键值对即一个标识符(键)对应一个数值。用来编辑注册表的图形化应用即注册表编辑器，其执行程序在注册表中被记为regedit，rege即regesiter，dit即edit。

键一般以标识符命名，其包括值和子键，值可以是字符串，二进制和32位值，由于键可以包含子键，这就描述了一种包含关系，包含子键的键称为子键的父键，没有父键的键被称为根键，注册表中一般有以下五个根键：

根键名|功能
:-:|:-:
HKEY_CLASSES_ROOT (HKCR)|存储文件关联信息、COM 对象注册数据和 OLE 配置
HKEY_CURRENT_USER (HKCU)|存储当前登录用户的个性化配置和软件设置
HKEY_LOCAL_MACHINE (HKLM)|存储针对整台计算机（对所有用户生效）的系统及硬件配置
HKEY_USERS (HKU)|存储计算机上所有用户配置文件的详细数据
HKEY_CURRENT_CONFIG (HKCC)|存储当前硬件配置文件的动态信息（主要与硬件和驱动相关）

而我们解决该问题打开键的路径，其中各键标识符含义为

HKEY_LOCAL_MACHINE
系统级根键，简称 HKLM。用于存储针对整台计算机（对当前设备上的所有用户生效）的系统、硬件及软件配置信息。

SOFTWARE
软件配置子键。用于存放计算机上已安装软件的全局配置参数和注册数据。

WOW6432Node
Windows on Windows 64-bit 的 32位兼容层节点。在 64位 Windows 系统中，为了防止 32位程序与 64位程序的注册表数据发生冲突，系统通过注册表重定向机制，将 32位应用程序的配置隔离在此节点下。

Microsoft
微软公司专用的配置节点。存放与 Windows 操作系统及微软相关组件、框架相关的设置。

CurrentVersion
当前系统版本配置节点。存放当前 Windows 系统的版本信息、核心组件参数以及系统级的管理配置。

Uninstall
卸载信息子键。存放已安装软件的卸载与修改信息。控制面板中的“程序和功能”（或“设置-安装的应用”）会读取该键下的子项，用来生成已安装软件列表并调用相应的卸载程序。

## 蓝牙耳机已连接但无法作为输入输出设备

### 发生原因
发生这种情况可能有以下原因：
### 解决方法
- 使用快捷键Win+R打卡“运行”程序，输入并运行“services.msc”，其中msc是Microsoft manage console snap-in control(微软管理控制台插件)，找到其中的“BluetoothUserService_xxx”服务，其中_xx是随机生成的编号，用于标识当前服务的用户等，重启服务
- 同样在services.msc中，重启服务"Windows Audio"和"Windows Audio Endpoint Builder"
- 右击底部栏的Windows徽标（Windows11），选择设备管理器并单击打开，找到声音、视频和游戏控制器，单击左侧尖括号打开下拉栏，禁用以耳机名命名或由你自定义命名的设备，包括Hands-Free（免提）设备，几秒后重新启用设备。尝试重新连接蓝牙设备
### 计算机通识知识

## 部分应用底部栏状态无法显示图标

### 发生原因

Windows系统内的图标都是通过读取存放在特定文件夹下的快捷方式，获取到对应应用的执行程序，并加载出其对应的图标。因此，当您遇到应用图标无法加载的情况时，应首先判断，是否存在移动过应用所在文件夹的行为，因为这会导致原本存储的快捷方式指向位置失效，而Windows仍然沿着旧快捷方式指向位置寻找应用程序，出现错误而导致图标不能够正常加载以默认文件图标或默认应用程序图标显示。

您可以通过以下步骤判断图标依赖的快捷方式是否失效（小编以Edge浏览器为例）。

1. 打开出现问题的应用，鼠标右键单击该应用在底部栏的图标，弹出如下图所示的二级窗口。

<div align = center><img src = "../../assets\image\notes_by_myself\Windows Questions\3-1.png"></div>

2. 再次鼠标右键单击新窗口中的Microsoft Edge应用，弹出如下图所示的三级窗口。

<div align = center><img src = "../../assets\image\notes_by_myself\Windows Questions\3-2.png"></div>

3. 点击三级窗口中的属性，在新打开的窗口中选择快捷方式选项卡(默认打开时处于快捷方式选项卡中)，图中的'目标'为快捷方式指向的应用运行程序存放位置，'起始位置'则为该快捷方式存放的文件夹。

4. 点击打开"文件所在位置"即可快速跳转到目标应用程序所在位置，若您确认目标应用程序已更改位置，或点击后提示该文件夹已不存在，则说明是您移动了应用执行程序位置导致的图标渲染失败。

<div align = center><img src = "../../assets\image\notes_by_myself\Windows Questions\3-3.png"></div>

5. 复制起始位置的文件地址，通过快捷键`Win + E`打开文件管理器，粘贴该路径，删除旧快捷方式，粘贴新快捷方式（请找到您电脑上该应用程序新的位置，右击执行程序，在新弹出的菜单栏中选择添加快捷方式，剪切该快捷方式），重启Edge浏览器，观察图标是否渲染正常。

### 解决方法

若经过上述步骤，您的应用图标渲染仍然异常，则可能是图标缓存损坏，请按照下述步骤尝试，但在继续处理该问题前，请保存您的工作文件。

打开PowerShell执行以下命令：

```
Stop-Process -Name explorer -Force

Remove-Item "$env:LOCALAPPDATA\IconCache.db" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\iconcache*" -Force -ErrorAction SilentlyContinue

Start-Process explorer.exe
```

标志位`-Force`表示强制运行命令，`-ErrorAction SilentContinue`表示执行命令发生错误时不进行提醒且继续运行后续命令。

若特殊原因下，未能重新启动explorer.exe，可以打开任务管理器，点击运行新任务，输入explprer.exe，观察是否出现相关进程。

若expolorer.exe重新启动后，仍有部分图标迟迟未能加载，尝试重启电脑。