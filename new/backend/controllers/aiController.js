const { main } = require('../config/gemini.js');

/**
 * Generate professional summary for resume
 */
exports.generateSummary = async (req, res) => {
  try {
    const { experience, skills, targetRole } = req.body;

    if (!experience || !skills) {
      return res.status(400).json({
        message: 'Experience and skills are required'
      });
    }

    const prompt = `Generate a professional summary for a resume based on the following information:

Experience: ${JSON.stringify(experience)}
Skills: ${skills.join(', ')}
Target Role: ${targetRole || 'Software Developer'}

Please create a compelling professional summary that:
- Is 2-3 sentences long
- Highlights key achievements and skills
- Is tailored to the target role
- Uses professional language
- Focuses on value and impact

Return only the summary text without any additional formatting or explanations.`;

    const result = await main(prompt);
    const response = result;
    const summary = response.text;

    res.json({
      message: 'Summary generated successfully',
      data: { summary }
    });

  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({
      message: 'Failed to generate summary',
      error: error.message
    });
  }
};

/**
 * Improve job descriptions and achievements
 */
exports.improveJobDescription = async (req, res) => {
  try {
    const { position, company, currentDescription, achievements } = req.body;

    if (!position || !currentDescription) {
      return res.status(400).json({
        message: 'Position and current description are required'
      });
    }

    // Compose the prompt for Gemini
    const prompt = [
      {
        role: "user",
        parts: [
          {
            text: `Improve the following job description and generate 2 short achievements for a resume.\n\nPosition: ${position}\nCompany: ${company || 'Company'}\nCurrent Description: ${currentDescription}\nCurrent Achievements: ${achievements ? achievements.join(', ') : 'None provided'}\n\nPlease provide:\n1. An improved job description (max 25 words, action verbs, quantifiable results, single sentence).\n2. 2 achievements (each max 15 words, concise, action verbs, bullet points).\n\nReturn the response in JSON format:\n{\n  "improvedDescription": "improved description text",\n  "improvedAchievements": ["achievement 1", "achievement 2"]\n}`
          }
        ]
      }
    ];

    const response = await main(prompt);

    let text = null;
    if (
      response &&
      response.response &&
      Array.isArray(response.response.candidates) &&
      response.response.candidates[0] &&
      response.response.candidates[0].content &&
      Array.isArray(response.response.candidates[0].content.parts) &&
      response.response.candidates[0].content.parts[0] &&
      typeof response.response.candidates[0].content.parts[0].text === 'string'
    ) {
      text = response.response.candidates[0].content.parts[0].text;
    } else if (
      response &&
      response.candidates &&
      Array.isArray(response.candidates) &&
      response.candidates[0] &&
      response.candidates[0].content &&
      Array.isArray(response.candidates[0].content.parts) &&
      response.candidates[0].content.parts[0] &&
      typeof response.candidates[0].content.parts[0].text === 'string'
    ) {
      // Some Gemini SDKs may return response.candidates directly
      text = response.candidates[0].content.parts[0].text;
    }

    if (!text) {
      // Fallback: log the full response for debugging
      console.error('Gemini API unexpected response:', JSON.stringify(response, null, 2));
      return res.json({
        message: 'Job description improved successfully (fallback)',
        data: {
          improvedDescription: 'AI could not generate a description. Please try again.',
          improvedAchievements: ['AI could not generate achievements. Please try again.']
        }
      });
    }

    // Remove code block and backticks if present
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    // Try to parse JSON response
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = {
        improvedDescription: text,
        improvedAchievements: []
      };
    }

    res.json({
      message: 'Job description improved successfully',
      data: parsed
    });

  } catch (error) {
    console.error('Improve job description error:', error);
    res.status(500).json({
      message: 'Failed to improve job description',
      error: error.message
    });
  }
};

/**
 * Generate skills suggestions based on experience
 */
exports.suggestSkills = async (req, res) => {
  try {
    const { experience, targetRole, currentSkills } = req.body;

    if (!experience) {
      return res.status(400).json({
        message: 'Experience is required'
      });
    }

    const prompt = `Based on the following work experience, suggest relevant skills for a resume:\n\nExperience: ${JSON.stringify(experience)}\nTarget Role: ${targetRole || 'Software Developer'}\nCurrent Skills: ${currentSkills ? currentSkills.join(', ') : 'None'}\n\nPlease suggest:\n1. Technical skills (programming languages, tools, technologies)\n2. Soft skills (communication, leadership, problem-solving)\n3. Industry-specific skills\n\nReturn the response in JSON format:\n{\n  "technicalSkills": ["skill1", "skill2", "skill3"],\n  "softSkills": ["skill1", "skill2", "skill3"],\n  "industrySkills": ["skill1", "skill2", "skill3"]\n}\n\nFocus on skills that are relevant to the target role and supported by the experience.`;

    const response = await main([
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]);

    let text = null;
    if (
      response &&
      response.response &&
      Array.isArray(response.response.candidates) &&
      response.response.candidates[0] &&
      response.response.candidates[0].content &&
      Array.isArray(response.response.candidates[0].content.parts) &&
      response.response.candidates[0].content.parts[0] &&
      typeof response.response.candidates[0].content.parts[0].text === 'string'
    ) {
      text = response.response.candidates[0].content.parts[0].text;
    } else if (
      response &&
      response.candidates &&
      Array.isArray(response.candidates) &&
      response.candidates[0] &&
      response.candidates[0].content &&
      Array.isArray(response.candidates[0].content.parts) &&
      response.candidates[0].content.parts[0] &&
      typeof response.candidates[0].content.parts[0].text === 'string'
    ) {
      text = response.candidates[0].content.parts[0].text;
    }

    if (!text) {
      console.error('Gemini API unexpected response:', JSON.stringify(response, null, 2));
      return res.json({
        message: 'Skills suggestions generated successfully (fallback)',
        data: {
          technicalSkills: [],
          softSkills: [],
          industrySkills: []
        }
      });
    }

    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = {
        technicalSkills: [],
        softSkills: [],
        industrySkills: []
      };
    }

    res.json({
      message: 'Skills suggestions generated successfully',
      data: parsed
    });

  } catch (error) {
    console.error('Suggest skills error:', error);
    res.status(500).json({
      message: 'Failed to suggest skills',
      error: error.message
    });
  }
};

/**
 * Generate project descriptions
 */
exports.generateProjectDescription = async (req, res) => {
  try {
    const { title, technologies, currentDescription } = req.body;

    if (!title || !technologies) {
      return res.status(400).json({
        message: 'Project title and technologies are required'
      });
    }

    const prompt = [
      {
        role: "user",
        parts: [
          {
            text: `Generate a compelling project description for a resume.\n\nProject Title: ${title}\nTechnologies Used: ${technologies.join(', ')}\nCurrent Description: ${currentDescription || 'None provided'}\n\nPlease create a project description that:\n- Is 2-3 sentences long\n- Explains the project's purpose and functionality\n- Highlights the technologies used\n- Mentions any notable features or achievements\n- Uses professional language\n- Demonstrates technical skills\n\nReturn only the description text without any additional formatting.`
          }
        ]
      }
    ];

    const response = await main(prompt);
    let text = null;
    if (
      response &&
      response.response &&
      Array.isArray(response.response.candidates) &&
      response.response.candidates[0] &&
      response.response.candidates[0].content &&
      Array.isArray(response.response.candidates[0].content.parts) &&
      response.response.candidates[0].content.parts[0] &&
      typeof response.response.candidates[0].content.parts[0].text === 'string'
    ) {
      text = response.response.candidates[0].content.parts[0].text;
    } else if (
      response &&
      response.candidates &&
      Array.isArray(response.candidates) &&
      response.candidates[0] &&
      response.candidates[0].content &&
      Array.isArray(response.candidates[0].content.parts) &&
      response.candidates[0].content.parts[0] &&
      typeof response.candidates[0].content.parts[0].text === 'string'
    ) {
      text = response.candidates[0].content.parts[0].text;
    }

    if (!text) {
      console.error('Gemini API unexpected response:', JSON.stringify(response, null, 2));
      return res.json({
        message: 'Project description generated successfully (fallback)',
        data: { description: 'AI could not generate a description. Please try again.' }
      });
    }

    res.json({
      message: 'Project description generated successfully',
      data: { description: text.trim() }
    });

  } catch (error) {
    console.error('Generate project description error:', error);
    res.status(500).json({
      message: 'Failed to generate project description',
      error: error.message
    });
  }
};

/**
 * Optimize resume for ATS (Applicant Tracking System)
 */
exports.optimizeForATS = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        message: 'Resume data is required'
      });
    }

    const prompt = [
      {
        role: "user",
        parts: [
          {
            text: `Analyze and optimize this resume for ATS (Applicant Tracking System) compatibility:\n\nResume Data: ${JSON.stringify(resumeData)}\nJob Description: ${jobDescription || 'General software development role'}\n\nPlease provide:\n1. Keyword suggestions to include\n2. Skills that should be highlighted\n3. Formatting recommendations\n4. Content improvements\n\nReturn the response in JSON format:\n{\n  \"keywordSuggestions\": [\"keyword1\", \"keyword2\"],\n  \"skillsToHighlight\": [\"skill1\", \"skill2\"],\n  \"formattingTips\": [\"tip1\", \"tip2\"],\n  \"contentImprovements\": [\"improvement1\", \"improvement2\"]\n}`
          }
        ]
      }
    ];

    const response = await main(prompt);
    let text = null;
    if (
      response &&
      response.response &&
      Array.isArray(response.response.candidates) &&
      response.response.candidates[0] &&
      response.response.candidates[0].content &&
      Array.isArray(response.response.candidates[0].content.parts) &&
      response.response.candidates[0].content.parts[0] &&
      typeof response.response.candidates[0].content.parts[0].text === 'string'
    ) {
      text = response.response.candidates[0].content.parts[0].text;
    } else if (
      response &&
      response.candidates &&
      Array.isArray(response.candidates) &&
      response.candidates[0] &&
      response.candidates[0].content &&
      Array.isArray(response.candidates[0].content.parts) &&
      response.candidates[0].content.parts[0] &&
      typeof response.candidates[0].content.parts[0].text === 'string'
    ) {
      text = response.candidates[0].content.parts[0].text;
    }

    if (!text) {
      return res.json({
        message: 'ATS optimization suggestions generated successfully (fallback)',
        data: {
          keywordSuggestions: [],
          skillsToHighlight: [],
          formattingTips: [],
          contentImprovements: []
        }
      });
    }

    // Remove code block and backticks if present
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      parsed = {
        keywordSuggestions: [],
        skillsToHighlight: [],
        formattingTips: [],
        contentImprovements: []
      };
    }

    res.json({
      message: 'ATS optimization suggestions generated successfully',
      data: parsed
    });

  } catch (error) {
    console.error('Optimize for ATS error:', error);
    res.status(500).json({
      message: 'Failed to optimize for ATS',
      error: error.message
    });
  }
}; 