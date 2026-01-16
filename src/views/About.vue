<template>
  <div class="about">
    <div class="about-content">
      <h1>关于我</h1>
      
      <div class="profile">
        <div class="avatar">
          <img src="@/assets/images/英明.jpg" alt="头像" />
        </div>
        <div class="info">
          <h2>BigBird</h2>
          <p class="desc">全栈开发工程师 | 技术爱好者</p>
          <div class="skills">
            <el-tag>Java</el-tag>
            <el-tag>Vue</el-tag>
            <el-tag>Adobe Premiere Pro</el-tag>
            <el-tag>Adobe PhotoShop</el-tag>
            <el-tag>Adobe Effects</el-tag>
          </div>
        </div>
      </div>

      <div class="introduction">
        <h2>个人介绍</h2>
        <p>
          你好，我是 大鹏，一个喜欢摄影和剪辑的普通菜鸡Java开发工程师。
          
        </p>
        <p>
          这是我用Claude Snonect 4.5模型帮助我制作的博客，
          希望我的文章能够帮助到大家。
        </p>
      </div>

      <div class="contact">
        <h2>联系方式</h2>
        <p>📧 邮箱: 963345804@qq.com</p>
        <p>🐙 GitHub: github.com/BigFriendBird</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.about-content h1 {
  font-size: 42px;
  margin-bottom: 40px;
  color: #fff;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile {
  display: flex;
  gap: 40px;
  margin-bottom: 50px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  align-items: center;
}

.avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.4);
  transition: all 0.3s ease;
}

.avatar img:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
}

.info h2 {
  font-size: 32px;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 600;
}

.desc {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  font-size: 17px;
}

.skills {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.skills :deep(.el-tag) {
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  font-size: 14px;
}

.introduction,
.contact {
  margin-bottom: 35px;
}

.introduction h2,
.contact h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #fff;
  font-weight: 600;
}

.introduction p,
.contact p {
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
  font-size: 16px;
}
</style>
