export const DATA = {
  logo: '../../assets/images/shikshagrahaLogo.png',
  headerBgColor: '#572e91',
  intro: {
    title: 'The Micro-Improvement Approach',
    description:
      'Micro-Improvements are short, relevant, and tangible improvements that are continuously implemented over time by leaders at all levels of the education ecosystem. The MI framework is designed to be highly inclusive and foster a culture of continuous improvement in the education system.',
    bgColor: '#572e91',
    banner: '../../assets/images/intro.png',
    bottomBanner: '../../assets/images/intro_bottom.png',
    buttons: [
      {
        label: 'Explore',
        action: '',
        url: '/home',
        alingment: 'center',
        color: 'dark',
      },
    ],
  },
  sections: [
    {
      content: {
        title: 'MItra',
        discription:
          'MItra is an AI-powered tool designed to help school leaders tackle their most pressing challenges with ease. Using natural language via text or voice, MItra enables leaders to discover Micro-Improvements (MIs), generate tailored plans with objectives and actions, and create impactful stories. MItra simplifies the journey of school improvement—one meaningful step at a time.',
        align: 'left',
      },
      media: {
        image: '../../assets/images/Left.png',
        align: 'right',
        type: 'image',
      },
      buttons: {
        label: 'Access MItra',
        action: '',
        url: '',
        alingment: 'left',
        color: 'dark',
      },
      backgroundImage: {
        desktop: '../../assets/images/Subtract.png',
        mobile: '../../assets/images/mobile_bg.png',
      },
    },
    {
      content: {
        title: 'My Impact Stories',
        discription:
          'Mohini is an AI-powered multi-lingual, voice-enabled chatbot that helps school leaders reflect on their Micro-Improvement journeys. Through guided prompts, Mohini enables leaders to share the highlights, challenges, and impact of their efforts, compiling responses into an inspiring and meaningful story.',
        align: 'right',
      },
      media: {
        image: '../../assets/images/Right.png',
        align: 'left',
        type: 'image',
      },
      buttons: {
        label: 'Record your story',
        action: '',
        url: '',
        alingment: 'left',
        color: 'dark',
      },
    },
    {
      content: {
        title: 'Micro-Improvement Dashboard',
        discription:
          'The MI Dashboard is a public, dynamic platform that provides  real-time data on micro-improvements offering insights at national, state, district, and school levels. Powered by data analytics and designed for scalability, this dashboard enables data-driven decisions that can transform schools at scale.',
        align: 'left',
      },
      media: {
        image: '../../assets/images/Portalvideowithmockup.mp4',
        type: 'video',
        align: 'right',
      },
      buttons: {
        label: 'Record your story',
        action: '',
        url: '',
        alingment: 'left',
        color: 'dark',
      },
      backgroundImage: {
        desktop: '../../assets/images/Frame_end_of_section_desk.png',
        mobile: '../../assets/images/Frame_end_of_section_mb.png',
      },
    },
  ],
  footer: {
    footerTitle: 'Join us for every step towards education',
    footerLogo: '../../assets/images/footer-logo.png',
    footerForm: [
      {
        label: 'First name',
        placeholder: 'Enter your first name',
        type: 'text',
        formControlName: 'firstName',
        validators: ['required'],
      },
      {
        label: 'Last name',
        placeholder: 'Enter your last name',
        type: 'text',
        formControlName: 'lastName',
        validators: ['required'],
      },
      {
        label: 'E-mail',
        placeholder: 'Enter your email',
        type: 'email',
        formControlName: 'email',
        validators: ['required', 'email'],
      },
      {
        label: 'Phone number',
        placeholder: 'Enter your phone number',
        type: 'tel',
        formControlName: 'phoneNumber',
        validators: ['required'],
      },
      {
        label: 'Organization',
        placeholder: 'Enter your organization',
        type: 'text',
        formControlName: 'organization',
      },
      {
        label: 'Industry',
        placeholder: 'Enter your industry',
        type: 'text',
        formControlName: 'industry',
      },
    ],
  },
};
