import Test from '../models/testSchema.js';
import AssignedTest from '../models/assignedTestSchema.js';

// Admin: Create Test
export const createTest = async (req, res, next) => {
  try {
    const test = new Test({ ...req.body });
    await test.save();
    res.status(201).json(test);
  } catch (err) { next(err); }
};

// Admin: List/Manage Tests
export const listTests = async (req, res, next) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) { next(err); }
};

// Admin: Assign Test
export const assignTest = async (req, res, next) => {
  try {
    const { testId, candidateId } = req.body;
    const assignedTestData = {
      test: testId,
      candidate: candidateId
    };
    if (req.user && req.user._id) {
      assignedTestData.assignedBy = req.user._id;
    }
    const assigned = new AssignedTest(assignedTestData);
    await assigned.save();
    res.status(201).json(assigned);
  } catch (err) { next(err); }
};

// Admin: List Assigned Tests
export const listAssignedTests = async (req, res, next) => {
  try {
    const assigned = await AssignedTest.find()
      .populate('test')
      .populate('candidate', 'fullName email');
    res.json(assigned);
  } catch (err) { next(err); }
};

// Candidate: List My Assigned Tests
export const listMyTests = async (req, res, next) => {
  try {
    let candidateId;
    if (req.user && req.user._id) {
      candidateId = req.user._id;
    } else if (req.query.candidateId) {
      candidateId = req.query.candidateId;
    } else {
      return res.status(400).json({ message: 'Candidate ID required' });
    }
    const myTests = await AssignedTest.find({ candidate: candidateId })
      .populate('test');
    res.json(myTests);
  } catch (err) { next(err); }
};

// Candidate: Submit Test
export const submitTest = async (req, res, next) => {
  try {
    const { assignedTestId, answers } = req.body;
    const assigned = await AssignedTest.findById(assignedTestId).populate('test');
    if (!assigned) return res.status(404).json({ message: 'Not found' });

    let score = 0;
    const answerResults = assigned.test.questions.map((q, idx) => {
      const selected = answers[idx];
      const correct = selected === q.answer;
      if (correct) score++;
      return { question: q.question, selected, correct };
    });

    assigned.answers = answerResults;
    assigned.status = 'Completed';
    assigned.completedAt = new Date();
    assigned.score = score;
    await assigned.save();

    res.json({ score, total: assigned.test.questions.length, answers: answerResults });
  } catch (err) { next(err); }
};

export const deleteTest = async (req, res, next) => {
  try {
    const result = await Test.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Test not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const updateTest = async (req, res, next) => {
  try {
    const updated = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Test not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}; 