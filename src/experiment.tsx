/**
 * @title human_emotion_rate
 * @description human rate emoation
 * @version 1.0.0
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
