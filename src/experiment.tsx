/**
 * @title human_emotion_rate
 * @description human rate emoation
 * @version 2.0.4
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import PreloadPlugin from "@jspsych/plugin-preload";
import { JsPsych, initJsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import ReactMobileFormPlugin from "@jspsych-contrib/plugin-mobileform-tsx";
import ReactNewIntroPlugin from "@jspsych-contrib/plugin-newintro-tsx";
import ReactMobileRatePlugin from "@jspsych-contrib/plugin-mobilerate-tsx";
import "react-vant/lib/index.css";
import '@nutui/nutui-react/dist/style.css'

// 添加一个检测用户是否使用微信浏览器的函数
function isWechatBrowser() {
  if (typeof WeixinJSBridge !== "undefined") {
    return true;
  }
}
// 函数校验
const customValidator = (rule: any, value: string) => {
  return /^\d+$/.test(value)
}

const valueRangeValidator = (rule: any, value: string) => {
  return /^(\d{1,2}|1\d{2}|200)$/.test(value)
}

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  const jsPsych = initJsPsych();
  // 在这里检查浏览器是否是微信
  if (!isWechatBrowser()) {
    alert("请在微信中打开此页面");
    return;
  }

  const timeline: any = [];
  // pc_flag = !pc_flag;
  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });
  // read question_list from output.json
  let question_list_path = assetPaths.misc[0];
  let question_list = await fetch(question_list_path).then((res) => res.json());
  /* define instructions trial */
  let instructions = {
    type: ReactNewIntroPlugin,
  };
  timeline.push(instructions);
  // Traverse the question list and add each question to the timeline
  for (let i = 0; i < question_list.length; i++) {
    let question = question_list[i];
    let question_trial = {
      type: ReactMobileRatePlugin,
      question: question.Story,
      emotion_names: question.Options,
      completedQuestions: i,
      totalQuestions: question_list.length,
      infoMessagePrefix: "当前总分为：", // Add infoMessagePrefix to the object
      errorMessagePrefix: "总分必须为10,而当前为:", // Add errorMessagePrefix to the object
      data: {
        "Story": question.Story
      }
    };
    timeline.push(question_trial);
  }
  let survey = {
    type: ReactMobileFormPlugin,
    title: '请填写您的信息',
    items: [
      {
        type: 'number',
        label: '年龄',
        name: 'age',
        placeholder: '请输入您的年龄',
        required: true,
        rules: [
          { required: true, message: '请输入年龄' },
          { validator: customValidator, message: '必须输入数字' },
          { validator: valueRangeValidator, message: '必须输入0-200区间' },
        ],
      },
      {
        type: 'radio',
        label: '性别',
        name: 'gender',
        required: true,
        rules: [{ required: true, message: '请选择性别' }],
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ],
      },
      {
        type: 'radio',
        label: '学历',
        name: 'education',
        required: true,
        rules: [{ required: true, message: '请选择学历' }],
        options: [
          { label: '初中及以下', value: 'junior_middle_school_and_below' },
          { label: '高中', value: 'senior_middle_school' },
          { label: '专科', value: 'junior_college' },
          { label: '本科', value: 'undergraduate' },
          { label: '研究生', value: 'postgraduate' },
        ],
      },
      {
        type: 'radio',
        label: '职业',
        name: 'job',
        required: true,
        rules: [{ required: true, message: '请选择职业' }],
        options: [
          { label: '学生', value: 'student' },
          { label: '民营企业工作人员', value: 'private_sector_employee' },
          { label: '个体经营或创业者', value: 'individual_entrepreneur' },
          { label: '党政机关或事业单位工作人员', value: 'government_or_public_institution_employee' },
          { label: '国有企业工作人员', value: 'state_owned_enterprise_employee' },
          { label: '退休人员', value: 'retiree' },
          { label: '失业/无业/待业人员', value: 'unemployed' },
          { label: '其他', value: 'others' },
        ],
      },
    ],
    submit_button: '提交数据',
    submit_button_size: 'large',
  };
  timeline.push(survey);
  // Start the experiment
  await jsPsych.run(timeline);
  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
