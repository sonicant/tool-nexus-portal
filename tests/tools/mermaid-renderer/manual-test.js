#!/usr/bin/env node

/**
 * Mermaid渲染工具手动测试脚本
 * 用于快速验证工具的基本功能
 */

console.log('🧪 Mermaid渲染工具手动测试');
console.log('================================\n');

// 测试用例
const testCases = [
  {
    name: '流程图 (Flowchart)',
    code: `flowchart TD
    A[开始] --> B{判断条件}
    B -->|是| C[处理]
    B -->|否| D[结束]
    C --> D`,
    expected: '应该显示一个包含开始、判断、处理、结束节点的流程图'
  },
  {
    name: '时序图 (Sequence Diagram)',
    code: `sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 发送请求
    系统-->>用户: 返回响应`,
    expected: '应该显示用户和系统之间的交互时序'
  },
  {
    name: '类图 (Class Diagram)',
    code: `classDiagram
    class 动物 {
      +String 名称
      +int 年龄
      +发声()
    }
    class 狗 {
      +String 品种
      +吠叫()
    }
    动物 <|-- 狗`,
    expected: '应该显示动物和狗的类继承关系'
  },
  {
    name: '饼图 (Pie Chart)',
    code: `pie title 宠物收养统计
    "狗" : 42.96
    "猫" : 50.05
    "鸟" : 7.01`,
    expected: '应该显示宠物收养的饼状图'
  },
  {
    name: '象限图 (Quadrant Chart)',
    code: `quadrantChart
    title 影响力与触达范围
    x-axis 低触达 --> 高触达
    y-axis 低影响 --> 高影响
    quadrant-1 我们应该扩展
    quadrant-2 需要推广
    quadrant-3 重新评估
    quadrant-4 可以改进`,
    expected: '应该显示四象限分析图'
  },
  {
    name: 'XY图表 (XY Chart)',
    code: `xychart-beta
    title "销售收入"
    x-axis [1月, 2月, 3月, 4月, 5月, 6月]
    y-axis "收入 (万元)" 0 --> 100
    bar [50, 60, 75, 82, 95, 88]`,
    expected: '应该显示月度销售收入柱状图'
  }
];

// 模拟测试函数
function simulateTest(testCase, index) {
  console.log(`${index + 1}. 测试: ${testCase.name}`);
  console.log('   代码:');
  console.log('   ```mermaid');
  console.log('   ' + testCase.code.replace(/\n/g, '\n   '));
  console.log('   ```');
  console.log(`   预期结果: ${testCase.expected}`);
  console.log('   ✅ 请在浏览器中验证渲染结果\n');
}

// 运行测试
console.log('📋 测试清单:');
console.log('请按照以下步骤在浏览器中手动测试:\n');

testCases.forEach(simulateTest);

console.log('🔧 额外测试项目:');
console.log('7. 模板选择功能');
console.log('   - 验证下拉菜单显示所有模板名称');
console.log('   - 验证选择模板后代码编辑器自动填充');
console.log('   - 验证中英文切换时模板名称正确显示\n');

console.log('8. 代码编辑功能');
console.log('   - 验证代码编辑器语法高亮');
console.log('   - 验证手动输入代码后图表实时更新');
console.log('   - 验证错误代码的处理\n');

console.log('9. 导出功能');
console.log('   - 验证SVG导出功能');
console.log('   - 验证PNG导出功能');
console.log('   - 验证导出文件的质量\n');

console.log('10. 响应式设计');
console.log('   - 验证在不同屏幕尺寸下的显示效果');
console.log('   - 验证移动端的触摸交互');
console.log('   - 验证代码编辑器在小屏幕上的可用性\n');

console.log('11. 国际化功能');
console.log('   - 验证中英文界面切换');
console.log('   - 验证所有文本的翻译完整性');
console.log('   - 验证模板描述的多语言显示\n');

console.log('12. 错误处理');
console.log('   - 输入无效的Mermaid代码');
console.log('   - 测试网络连接问题的处理');
console.log('   - 验证用户友好的错误提示\n');

console.log('📝 测试记录:');
console.log('请在测试过程中记录以下信息:');
console.log('- 功能是否正常工作');
console.log('- 性能表现(渲染速度)');
console.log('- 用户体验问题');
console.log('- 发现的bug或改进建议\n');

console.log('🎯 测试完成标准:');
console.log('- 所有图表类型都能正确渲染');
console.log('- 模板选择和代码编辑功能正常');
console.log('- 导出功能工作正常');
console.log('- 响应式设计在各种设备上表现良好');
console.log('- 国际化功能完整');
console.log('- 错误处理机制有效\n');

console.log('✨ 开始手动测试，祝测试顺利!');