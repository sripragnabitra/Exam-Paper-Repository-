// backend/controllers/searchController.js
import Paper from "../models/Paper.js";
import Question from "../models/Question.js";

export const searchPapers = async (req, res) => {
  try {
    const { courseCode, academicYear, semester, keywords, topic, page = 1, limit = 20 } = req.query;
    const paperFilter = {};
    if (courseCode) paperFilter.courseCode = courseCode;
    if (academicYear) paperFilter.academicYear = academicYear;
    if (semester) paperFilter.semester = semester;

    // If keywords provided — search in questions first (better granularity)
    if (keywords) {
      const qMatch = { text: { $regex: keywords, $options: "i" } };
      if (topic) qMatch.topic = topic;

      const matchedQuestions = await Question.find(qMatch).limit(500);
      const paperIds = [...new Set(matchedQuestions.map((q) => String(q.paper)))];

      const papers = await Paper.find({ _id: { $in: paperIds }, ...paperFilter })
        .populate("uploader", "fullName email")
        .lean();

      // attach matched question snippets
      const map = {};
      matchedQuestions.forEach((q) => {
        const pid = String(q.paper);
        if (!map[pid]) map[pid] = [];
        map[pid].push({ id: q._id, text: q.text });
      });

      const results = papers.map((p) => ({ ...p, matchedQuestions: map[String(p._id)] || [] }));
      return res.json({ results, total: results.length });
    }

    // No keywords: search papers
    const papers = await Paper.find(paperFilter)
      .populate("uploader", "fullName email")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Paper.countDocuments(paperFilter);
    res.json({ results: papers, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search error" });
  }
};
