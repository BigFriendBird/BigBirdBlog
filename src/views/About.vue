<template>
  <div class="about">
    <div class="about-content">
      <h1>关于我</h1>
      
      <div class="profile">
        <div class="avatar">
          <img src="https://via.placeholder.com/150" alt="头像" />
        </div>
        <div class="info">
          <h2>BigBird</h2>
          <p class="desc">全栈开发工程师 | 技术爱好者</p>
          <div class="skills">
            <el-tag>Vue</el-tag>
            <el-tag>Spring Boot</el-tag>
            <el-tag>Java</el-tag>
            <el-tag>JavaScript</el-tag>
          </div>
        </div>
      </div>

      <div class="introduction">
        <h2>个人介绍</h2>
        <p>
          你好，我是 BigBird，一名热爱技术的全栈开发工程师。
          我专注于 Web 开发，熟悉 Vue、Spring Boot 等技术栈。
        </p>
        <p>
          这个博客是我用来分享技术文章、记录学习心得的地方。
          希望我的文章能够帮助到大家。
        </p>
      </div>

      <div class="contact">
        <h2>联系方式</h2>
        <p>📧 邮箱: bigbird@example.com</p>
        <p>🐙 GitHub: github.com/bigbird</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.about-content h1 {
  font-size: 36px;
  margin-bottom: 30px;
  color: #333;
}

.profile {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
}

.avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.info h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

.desc {
  color: #666;
  margin-bottom: 15px;
  font-size: 16px;
}

.skills {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.introduction,
.contact {
  margin-bottom: 30px;
}

.introduction h2,
.contact h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

.introduction p,
.contact p {
  line-height: 1.8;
  color: #666;
  margin-bottom: 10px;
}
</style>
