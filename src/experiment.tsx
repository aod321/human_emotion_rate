/**
 * @title human_emotion_rate
 * @description human rate emoation
 * @version 2.0.2
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
  if( typeof WeixinJSBridge !== "undefined" ) {
    return true;
  }
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
  let survey = {
    type: ReactMobileFormPlugin,
    title: '欢迎您来做实验',
    items: [
      {
        type: 'number',
        label: '年龄',
        name: 'age',
        placeholder: '请输入您的年龄',
      },
      {
        type: 'radio',
        label: '性别',
        name: 'gender',
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ],
      },
    ],
    submit_button: '继续',
    submit_button_size: 'large',
  };
  timeline.push(survey);
  // Traverse the question list and add each question to the timeline
  for (let i = 0; i < question_list.length; i++) {
    let question = question_list[i];
    let question_trial = {
      type: ReactMobileRatePlugin,
      question: question.Story,
      emotion_names: question.Options,
      infoMessagePrefix: "当前总分为：", // Add infoMessagePrefix to the object
      errorMessagePrefix: "总分必须为10,而当前为:", // Add errorMessagePrefix to the object
      data:{
        "Story": question.Story
      }
    };
    timeline.push(question_trial);
  }
  // Start the experiment
  await jsPsych.run(timeline);
  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
