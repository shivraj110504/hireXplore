import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

// Advanced Heuristic Resume Parsing
function extractSection(text: string, startKeywords: string[], endKeywords: string[]): string {
  let startIndex = -1;
  for (const keyword of startKeywords) {
    const idx = text.indexOf(keyword);
    if (idx !== -1 && (startIndex === -1 || idx < startIndex)) {
      startIndex = idx;
    }
  }

  if (startIndex === -1) return "";

  let endIndex = text.length;
  for (const keyword of endKeywords) {
    const idx = text.indexOf(keyword, startIndex + 20); // allow some buffer
    if (idx !== -1 && idx < endIndex) {
      endIndex = idx;
    }
  }

  return text.substring(startIndex, endIndex).trim();
}

function extractSkills(text: string): string[] {
  const commonSkills = [
    "javascript", "typescript", "react", "node.js", "next.js", "python", "java", "c++", 
    "mongodb", "sql", "postgresql", "docker", "aws", "git", "html", "css", "tailwind",
    "express", "angular", "vue", "kubernetes", "linux", "gcp", "azure"
  ];
  
  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();
  
  for (const skill of commonSkills) {
    if (lowerText.includes(skill)) {
      foundSkills.add(skill);
    }
  }
  
  return Array.from(foundSkills);
}

function parseExperience(text: string) {
  const expSection = extractSection(
    text.toLowerCase(), 
    ["experience", "employment", "work history"], 
    ["education", "projects", "skills", "certifications", "volunteer"]
  );
  
  if (!expSection || expSection.length < 20) return [];

  const dateRegex = /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}|\d{4})\s*(?:-|to|–)\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}|\d{4}|present|current)/gi;
  const matches = [...expSection.matchAll(dateRegex)];
  
  if (matches.length === 0) {
    return [{
      company: "Review Resume Manually",
      role: "Professional Role",
      duration: "Duration",
      description: expSection.substring(0, 300) + "..."
    }];
  }

  const results = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const nextMatch = matches[i + 1];
    
    const precedingStart = i === 0 ? 0 : matches[i-1].index! + matches[i-1][0].length;
    const precedingText = expSection.substring(precedingStart, match.index).trim();
    
    const lines = precedingText.split(/\n+/).map(l => l.trim()).filter(l => l.length > 3);
    const roleOrCompany = lines.slice(-2).join(' | ');

    const descStartIndex = match.index! + match[0].length;
    const descEndIndex = nextMatch ? nextMatch.index : expSection.length;
    const description = expSection.substring(descStartIndex, descEndIndex).trim();

    const parts = roleOrCompany.split('|').map(p => p.trim());
    results.push({
      company: parts[0] || "Company",
      role: parts[1] || parts[0] || "Role",
      duration: match[0].trim(),
      description: description.substring(0, 500)
    });
  }
  return results;
}

function parseEducation(text: string) {
  const eduSection = extractSection(
    text.toLowerCase(), 
    ["education", "academic"], 
    ["experience", "projects", "skills", "certifications", "employment"]
  );
  
  if (!eduSection || eduSection.length < 10) return [];

  const degreeRegex = /(bachelor|master|b\.s|m\.s|b\.a|b\.e|b\.tech|m\.tech|phd|associate|degree|diploma)/gi;
  const matches = [...eduSection.matchAll(degreeRegex)];
  
  if (matches.length === 0) {
    return [{
      institution: "Review Resume Manually",
      degree: "Degree",
      year: "Year",
      description: eduSection.substring(0, 150) + "..."
    }];
  }

  const results = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const nextMatch = matches[i + 1];
    
    const chunkEndIndex = nextMatch ? nextMatch.index : eduSection.length;
    const chunk = eduSection.substring(match.index!, chunkEndIndex).trim();
    
    const lines = chunk.split(/\n+/).filter(l => l.trim().length > 3);
    const degreeLine = lines[0] || match[0];
    
    const yearMatch = chunk.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? yearMatch[0] : "Year";
    
    results.push({
      institution: lines[1] ? lines[1].trim() : "Institution",
      degree: degreeLine.substring(0, 100),
      year: year,
      description: chunk.substring(0, 250)
    });
  }
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Foolproof parsing using a native child process to bypass NextJS Webpack entirely
    const fs = require("fs");
    const path = require("path");
    const { execSync } = require("child_process");
    
    const tempPdfPath = path.join(process.cwd(), `temp_${Date.now()}.pdf`);
    const tempScriptPath = path.join(process.cwd(), `temp_script_${Date.now()}.js`);
    
    let text = "";
    try {
      fs.writeFileSync(tempPdfPath, buffer);
      
      const scriptCode = `
        const { PDFParse } = require('pdf-parse');
        const fs = require('fs');
        async function run() {
          try {
            const data = fs.readFileSync('${tempPdfPath.replace(/\\/g, '/')}');
            const parser = new PDFParse({ data });
            const result = await parser.getText();
            console.log(JSON.stringify({ success: true, text: result.text }));
          } catch(e) {
            console.log(JSON.stringify({ success: false, error: e.message }));
          }
        }
        run();
      `;
      
      fs.writeFileSync(tempScriptPath, scriptCode);
      const output = execSync(`node "${tempScriptPath}"`).toString();
      const result = JSON.parse(output.trim());
      
      if (!result.success) throw new Error(result.error);
      text = result.text;
    } finally {
      if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
      if (fs.existsSync(tempScriptPath)) fs.unlinkSync(tempScriptPath);
    }

    // 2. Extract Data
    const skills = extractSkills(text);
    const experience = parseExperience(text);
    const education = parseEducation(text);

    // 3. Update MongoDB Profile
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "hirexplore");
    
    // We only $set these fields if they exist, to not overwrite manual edits completely
    // But the requirement says: "automatically displayed in the profile... reflects everything"
    await db.collection("profiles").updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          userId: session.user.id,
          skills: skills,
          experience: experience,
          education: education,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, skills, experience, education });
  } catch (error: any) {
    console.error("Parse resume error:", error);
    return NextResponse.json({ error: "Failed to parse resume", details: error.message }, { status: 500 });
  }
}
