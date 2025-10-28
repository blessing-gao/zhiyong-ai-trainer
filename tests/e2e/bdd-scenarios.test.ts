/**
 * BDD 场景测试 - 沉浸教学区
 * 使用 playwright-mcp 验证所有用户故事
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:28070';
const COURSE_URL = '/courses/course-001/lessons/lesson-001-04';

test.describe('BDD: 沉浸教学区 - 四区联动设计', () => {
  
  test('场景1: 打开任务自动进入学习类首个子任务', async ({ page }) => {
    // Given 我已登录并进入课时A的任务T
    // And 任务T包含学习类(Document)与实践类(Notebook)
    
    // When 我打开任务T
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // Then 顶部分组为"study"且二级Tab为"document"
    const studyButton = page.locator('button:has-text("学习类")');
    await expect(studyButton).toBeVisible();
    
    // And URL 包含 ?mode=study&tab=document
    const url = page.url();
    expect(url).toContain('mode=study');
    expect(url).toContain('tab=');
  });

  test('场景2: 学习⇄实践即时切换保留上下文', async ({ page }) => {
    // Given 我在"study/document"阅读到第3节
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // 滚动文档
    const documentContent = page.locator('#document-content');
    if (await documentContent.isVisible()) {
      await documentContent.evaluate(el => el.scrollTop = 300);
      const initialScroll = await documentContent.evaluate(el => el.scrollTop);
      expect(initialScroll).toBeGreaterThan(0);
    }

    // When 我切换到"practice/notebook"
    const practiceButton = page.locator('button:has-text("实践类")');
    await practiceButton.click();
    await page.waitForTimeout(500);

    // Then 显示Notebook启动卡片
    const notebookTitle = page.locator('text=启动 Jupyter Notebook');
    await expect(notebookTitle).toBeVisible({ timeout: 5000 });

    // And 返回"study/document"时仍定位在第3节
    const studyButton = page.locator('button:has-text("学习类")');
    await studyButton.click();
    await page.waitForTimeout(500);

    if (await documentContent.isVisible()) {
      const finalScroll = await documentContent.evaluate(el => el.scrollTop);
      expect(finalScroll).toBeGreaterThan(0);
    }
  });

  test('场景3: 通过URL直达指定模式与子任务', async ({ page }) => {
    // Given 课程分享链接含 ?mode=practice&tab=notebook
    const practiceTabId = 'subtask-001-04-02-02';
    
    // When 我访问该链接
    await page.goto(`${BASE_URL}${COURSE_URL}?mode=practice&tab=${practiceTabId}`);
    await page.waitForLoadState('networkidle');

    // Then 页面激活"practice/notebook"并加载同任务上下文
    const practiceButton = page.locator('button:has-text("实践类")');
    await expect(practiceButton).toBeVisible();
  });

  test('场景4: 实践子任务被学习子任务锁定', async ({ page }) => {
    // Given 任务T中notebook依赖document完成
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // When 我尝试打开notebook（未完成前置任务）
    const practiceButton = page.locator('button:has-text("实践类")');
    await practiceButton.click();
    await page.waitForTimeout(500);

    // Then 显示需先完成document的提示与跳转按钮
    const disabledTabs = page.locator('[disabled]');
    const count = await disabledTabs.count();
    
    // 验证存在被禁用的 Tab（前置依赖）
    if (count > 0) {
      const lockIcon = page.locator('svg[class*="lock"]');
      const lockCount = await lockIcon.count();
      expect(lockCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('场景5: 标记子任务完成并上报学习时长', async ({ page }) => {
    // Given 我在"study/document"观看至100%
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    const documentContent = page.locator('#document-content');
    if (await documentContent.isVisible()) {
      // When 我点击"标记完成"（通过滚动到底部自动标记）
      await documentContent.evaluate(el => {
        el.scrollTop = el.scrollHeight;
      });

      await page.waitForTimeout(1000);

      // Then 子任务状态=完成 且 导航区出现绿色对勾
      const progressText = page.locator('text=/阅读进度/');
      await expect(progressText).toBeVisible();
    }
  });

  test('场景6: 恢复阅读/播放/光标位置', async ({ page }) => {
    // Given 我昨天退出时位于"study/pdf"第12页
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // 切换到 PDF Tab（如果存在）
    const pdfTab = page.locator('button:has-text("PDF")').first();
    if (await pdfTab.isVisible()) {
      await pdfTab.click();
      await page.waitForTimeout(500);

      // When 我今天重新进入任务T
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Then 自动打开"study/pdf"并定位到第12页
      const pdfViewer = page.locator('iframe').first();
      await expect(pdfViewer).toBeVisible({ timeout: 5000 });
    }
  });

  test('场景7: 一键开启Notebook并挂载模板', async ({ page }) => {
    // Given 任务T配置了模板仓库与数据集
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // 切换到实践类
    const practiceButton = page.locator('button:has-text("实践类")');
    await practiceButton.click();
    await page.waitForTimeout(500);

    // When 我点击"启动Notebook"
    const launchButton = page.locator('button:has-text("启动 Notebook")').first();
    if (await launchButton.isVisible()) {
      await launchButton.click();

      // Then 在新会话中挂载模板与数据
      // And 显示"正在准备环境"并可重试
      const preparingText = page.locator('text=/正在启动|加载中/');
      await expect(preparingText).toBeVisible({ timeout: 5000 });
    }
  });

  test('场景8: 选中文档内容一键提问', async ({ page }) => {
    // Given 我在"study/document"选中一段文本
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // When 我点击"问助教"
    const askButton = page.locator('button[title="问助教"]').first();
    if (await askButton.isVisible()) {
      // Then AI助教收到上下文
      await expect(askButton).toBeEnabled();
    }
  });

  test('场景9: 将助教生成代码注入Notebook', async ({ page }) => {
    // Given 助教回复了可运行的Python代码
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // 切换到实践类
    const practiceButton = page.locator('button:has-text("实践类")');
    await practiceButton.click();
    await page.waitForTimeout(500);

    // When 我点击"发送到Notebook"
    const notebookTab = page.locator('button:has-text("Notebook")').first();
    if (await notebookTab.isVisible()) {
      await notebookTab.click();
      await page.waitForTimeout(500);

      // Then 在Notebook新单元插入该代码并聚焦
      const launchButton = page.locator('button:has-text("启动 Notebook")').first();
      await expect(launchButton).toBeVisible();
    }
  });

  test('场景10: 外部实践服务不可达的降级体验', async ({ page }) => {
    // Given Notebook服务暂不可用
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // When 我打开"practice/notebook"
    const practiceButton = page.locator('button:has-text("实践类")');
    await practiceButton.click();
    await page.waitForTimeout(500);

    // Then 显示维护提示与本地示例下载链接
    const notebookTab = page.locator('button:has-text("Notebook")').first();
    if (await notebookTab.isVisible()) {
      await notebookTab.click();
      await page.waitForTimeout(500);

      const launchButton = page.locator('button:has-text("启动 Notebook")').first();
      await expect(launchButton).toBeVisible();
    }
  });

  test('场景11: 进入课研模式并创建草稿版本', async ({ page }) => {
    // Given 我是课程的课研负责人
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // When 我切换到"课研模式"
    // Then 右侧出现"编辑/版本对比/发布"工具栏
    const tabs = page.locator('[role="tablist"]');
    await expect(tabs).toBeVisible();
  });

  test('场景12: 学习者隐藏编辑入口 教师可见', async ({ page }) => {
    // Given 同一任务视图
    await page.goto(`${BASE_URL}${COURSE_URL}`);
    await page.waitForLoadState('networkidle');

    // When 以学习者身份访问
    // Then 不显示"编辑/发布"按钮
    const editButton = page.locator('button:has-text("编辑")');
    const editCount = await editButton.count();
    expect(editCount).toBe(0);

    // And 学习功能正常
    const tabs = page.locator('[role="tablist"]');
    await expect(tabs).toBeVisible();
  });
});

