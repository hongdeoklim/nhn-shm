import Vue from "vue";

import CommaInput from "@/components/CommaInput.vue";
import MonthPicker from "@/components/MonthPicker.vue";
import MaxLengthInput from "@/components/MaxLengthInput.vue";
import MaxLengthTextarea from "@/components/MaxLengthTextarea.vue";
import MaxLengthEditor from "@/components/MaxLengthEditor.vue";
import HyphenInput from "@/components/HyphenInput.vue";
import RadioTypeCheck from "@/components/radio/RadioTypeCheck.vue";
import PhotoUploadGridModule from '@/views/modules/PhotoUploadGridModule'

Vue.component("CommaInput", CommaInput);
Vue.component("MonthPicker", MonthPicker);
Vue.component("MlInput", MaxLengthInput);
Vue.component("MlTextarea", MaxLengthTextarea);
Vue.component("MlEditor", MaxLengthEditor);
Vue.component("HyphenInput", HyphenInput);
Vue.component("RadioTypeCheck", RadioTypeCheck);
Vue.component("PhotoUploadGridModule", PhotoUploadGridModule);
