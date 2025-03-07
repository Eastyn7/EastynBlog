# Eastyn的个人博客网站

## 项目概述

**项目名称**：EastynBlog

**启动时间**：2025-03-07

**项目状态**：开发中

**技术栈**：

- 前端：Vue 3
- 后端：Node.js
- 数据库：MySQL

## 数据库

### 数据库设计

~~~mysql
-- 用户表：存储用户相关信息（例如作者、管理员和普通评论者）
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID，自增主键',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户登录名，唯一',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（存储加密后的值）',
  `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '用户邮箱，唯一',
  `role` VARCHAR(20) DEFAULT 'user' COMMENT '用户角色，如admin、editor、user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='用户表，存储博客用户信息';

-- 分类表：存储文章分类信息，便于内容归类和展示
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID，自增主键',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `slug` VARCHAR(50) NOT NULL COMMENT '友好URL别名',
  `description` TEXT COMMENT '分类描述信息',
  `parent_id` INT DEFAULT NULL COMMENT '父级分类ID，若无父级则为NULL',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`)
) COMMENT='分类表，用于存储文章的分类信息';

-- 文章表：存储博客文章的主体内容
CREATE TABLE `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '文章ID，自增主键',
  `user_id` INT NOT NULL COMMENT '作者用户ID，关联users表',
  `title` VARCHAR(255) NOT NULL COMMENT '文章标题',
  `slug` VARCHAR(255) NOT NULL COMMENT '友好URL别名',
  `content` TEXT NOT NULL COMMENT '文章正文内容',
  `summary` TEXT COMMENT '文章摘要，预览展示用',
  `category_id` INT COMMENT '分类ID，关联categories表',
  `view_count` INT DEFAULT 0 COMMENT '浏览次数',
  `status` ENUM('draft', 'published') DEFAULT 'draft' COMMENT '文章状态：草稿或已发布',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
) COMMENT='文章表，存储博客文章的详细信息';

-- 标签表：存储文章标签，用于内容关联和检索
CREATE TABLE `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '标签ID，自增主键',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `slug` VARCHAR(50) NOT NULL COMMENT '友好URL别名',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='标签表，用于管理文章的标签信息';

-- 文章与标签关联表：建立文章与标签之间的多对多关系
CREATE TABLE `post_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '关联记录ID，自增主键',
  `post_id` INT NOT NULL COMMENT '文章ID，关联posts表',
  `tag_id` INT NOT NULL COMMENT '标签ID，关联tags表',
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`),
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`)
) COMMENT='文章与标签关联表，建立文章与标签的多对多关系';

-- 评论表：存储用户对文章的评论信息
CREATE TABLE `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '评论ID，自增主键',
  `post_id` INT NOT NULL COMMENT '文章ID，关联posts表',
  `user_id` INT COMMENT '评论用户ID，关联users表；允许匿名评论则可为NULL',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `parent_id` INT DEFAULT NULL COMMENT '父级评论ID，用于实现评论嵌套，顶级评论为NULL',
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '评论状态：待审核、已发布、屏蔽',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '评论发布时间',
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`)
) COMMENT='评论表，用于存储文章的评论信息';

-- 附件表（可选）：存储文章相关的附件，如图片、视频等
CREATE TABLE `attachments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '附件ID，自增主键',
  `post_id` INT COMMENT '文章ID，关联posts表，可为空',
  `file_path` VARCHAR(255) NOT NULL COMMENT '文件路径或URL',
  `file_type` VARCHAR(50) COMMENT '文件类型，如image、video等',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`)
) COMMENT='附件表，用于存储文章的上传文件信息';
~~~

