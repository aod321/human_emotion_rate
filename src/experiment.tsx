/**
 * @title human_emotion_rate
 * @description human rate emoation
 * @version 1.0.4
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import * as React from "react";
import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOMServer from 'react-dom/server';
import '@nutui/nutui-react/dist/style.css'
import { Icon } from '@nutui/nutui-react';

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import SurveyHtmlFormPlugin from "@jspsych/plugin-survey-html-form";
import PreloadPlugin from "@jspsych/plugin-preload";
import { JsPsych, initJsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import ReactMobileFormPlugin from "@jspsych-contrib/plugin-mobileform-tsx";
import ReactMobileChoicePlugin from "@jspsych-contrib/plugin-mobilechoice-tsx";
import ReactMobileInfoPlugin from "@jspsych-contrib/plugin-mobileinfo-tsx";
import ReactMobileFourScorePlugin from "@jspsych-contrib/plugin-mobilefourscore-tsx";


/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  const jsPsych = initJsPsych();

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
    type: ReactMobileInfoPlugin,
    html: `
      <h1>实验指导语</h1>
      <p>您好，我们是来自【清华大学心理学系】的团队，正在对【情绪理解】进行调查。</p>
      <p>本问卷包括40道题目，每道题目包括一个小故事和四个情绪选项。请您认真阅读故事，根据主人公感受到的情绪的程度，将100分分配到4个情绪选项中。</p>
      <p>回答没有对错之分，请根据您的理解作答。</p>
      <p>例题：最近李梅帮助她的一位同事完成一个非常难的工作。但是这位同事却抱怨李梅做的工作不是很好，李梅会觉得：愤怒: 50,失望: 20,委屈: 20, 后悔: 10</p>
      <p>这个回答代表了：如果用100分代表江文此时所有的感受，那么江文觉得有50分的悲伤，20分的遗憾，20分的愤怒，10分的后悔。</p>
      <p>我们保证：本研究的结果可能会在学术期刊/书籍上发表，或者用于教学。但是您的名字或者其他可以确认您的信息将不会在任何发表或教学的材料中出现，除非得到您的允许。</p>
      <p>欢迎大家填写/转发本问卷！</p>
    `,
    button_text: '继续',
    button_size: 'large',
  };
  timeline.push(instructions);
  let survey = {
    type: ReactMobileFormPlugin,
    title: '欢迎您来做实验',
    items: [
      {
        type: 'text',
        label: '姓名',
        name: 'name',
        placeholder: '请输入您的姓名',
      },
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
      type: ReactMobileFourScorePlugin,
      question: question.Story,
      names: question.Options,
      buttonTitle: "提交", // Add buttonTitle to the object
      infoMessagePrefix: "当前总分为：", // Add infoMessagePrefix to the object
      errorMessagePrefix: "总分必须为100,而当前为:", // Add errorMessagePrefix to the object
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
