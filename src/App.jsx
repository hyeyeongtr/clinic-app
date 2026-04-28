import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Noto Sans KR', sans-serif; background: #f0f4f8; min-height: 100vh; }

  .page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    padding: 24px;
  }
  .card {
    background: white; border-radius: 20px; padding: 40px;
    width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .logo { text-align: center; margin-bottom: 32px; }
  .logo-badge {
    display: inline-block; background: linear-gradient(135deg, #0f3460, #533483);
    color: white; font-size: 11px; font-weight: 700; letter-spacing: 1px;
    padding: 6px 14px; border-radius: 20px; margin-bottom: 12px;
  }
  .logo h1 { font-family: 'Noto Sans KR', sans-serif; font-weight: 900; font-size: 26px; color: #1a1a2e; }
  .logo p { font-size: 13px; color: #888; margin-top: 6px; }

  .tabs { display: flex; background: #f0f4f8; border-radius: 10px; padding: 4px; margin-bottom: 28px; }
  .tab {
    flex: 1; padding: 10px; border: none; background: transparent;
    border-radius: 8px; font-family: 'Noto Sans KR', sans-serif;
    font-size: 14px; font-weight: 500; color: #888; cursor: pointer; transition: all 0.2s;
  }
  .tab.active { background: white; color: #0f3460; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 12px; font-weight: 700; color: #555; letter-spacing: 0.5px; margin-bottom: 6px; }
  .field input, .field select, .field textarea {
    width: 100%; padding: 12px 16px; border: 2px solid #e8edf2; border-radius: 10px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 14px; color: #1a1a2e;
    transition: border-color 0.2s; outline: none; background: white;
  }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: #0f3460; }
  .field input[readonly] { background: #f8fafc; color: #555; cursor: default; }
  .field textarea { resize: vertical; min-height: 80px; }

  .student-info-card {
    background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
    border: 2px solid #b0c4f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;
  }
  .student-info-card .info-title { font-size: 11px; font-weight: 700; color: #0f3460; letter-spacing: 1px; margin-bottom: 10px; }
  .student-info-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .student-info-row:last-child { margin-bottom: 0; }
  .info-label { font-size: 12px; color: #888; width: 60px; flex-shrink: 0; }
  .info-value { font-size: 14px; font-weight: 700; color: #1a1a2e; }

  .btn-primary {
    width: 100%; padding: 14px; background: linear-gradient(135deg, #0f3460, #533483);
    color: white; border: none; border-radius: 10px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; margin-top: 8px; transition: opacity 0.2s, transform 0.1s;
  }
  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.5; cursor: default; }

  .btn-outline {
    width: 100%; padding: 12px; background: white; color: #0f3460;
    border: 2px solid #0f3460; border-radius: 10px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; margin-top: 8px;
  }
  .btn-outline:hover { background: #f0f4ff; }

  .error { background: #fff0f0; border: 1px solid #ffcccc; color: #c00; font-size: 13px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
  .success { background: #f0fff4; border: 1px solid #b2f5c8; color: #1a7a3f; font-size: 13px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }

  /* APP LAYOUT */
  .app { min-height: 100vh; background: #f0f4f8; }
  .topbar {
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
    padding: 16px 24px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 10;
  }
  .topbar-title { color: white; font-size: 16px; font-weight: 700; }
  .topbar-sub { color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 2px; }
  .btn-logout {
    background: rgba(255,255,255,0.15); color: white; border: none;
    padding: 8px 16px; border-radius: 8px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 13px; cursor: pointer;
  }
  .btn-logout:hover { background: rgba(255,255,255,0.25); }
  .body { padding: 24px; max-width: 640px; margin: 0 auto; }

  .welcome-card {
    background: white; border-radius: 16px; padding: 20px 24px;
    margin-bottom: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .welcome-card h2 { font-size: 17px; color: #1a1a2e; margin-bottom: 4px; }
  .welcome-card p { font-size: 13px; color: #888; }

  /* ADMIN TABS */
  .admin-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .admin-tab {
    padding: 10px 18px; border: 2px solid #e8edf2; border-radius: 10px; background: white;
    font-family: 'Noto Sans KR', sans-serif; font-size: 13px; font-weight: 500; color: #888; cursor: pointer;
  }
  .admin-tab.active { border-color: #0f3460; color: #0f3460; font-weight: 700; background: #f0f4ff; }

  /* EXCEL UPLOAD */
  .upload-zone {
    border: 2px dashed #b0c4f0; border-radius: 16px; background: #f8faff;
    padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s;
    margin-bottom: 16px;
  }
  .upload-zone:hover { border-color: #0f3460; background: #f0f4ff; }
  .upload-zone.dragging { border-color: #0f3460; background: #e8efff; }
  .upload-icon { font-size: 36px; margin-bottom: 8px; }
  .upload-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
  .upload-sub { font-size: 12px; color: #888; }

  .roster-card {
    background: white; border-radius: 16px; padding: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 16px;
  }
  .roster-card h3 { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
  .roster-card .roster-sub { font-size: 12px; color: #888; margin-bottom: 16px; }

  .col-map { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .col-map h4 { font-size: 12px; font-weight: 700; color: #555; margin-bottom: 12px; letter-spacing: 0.5px; }
  .col-map-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .col-map-item label { display: block; font-size: 11px; font-weight: 700; color: #888; margin-bottom: 4px; }
  .col-map-item select {
    width: 100%; padding: 8px 10px; border: 2px solid #e8edf2; border-radius: 8px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 13px; color: #1a1a2e;
    outline: none; background: white;
  }
  .col-map-item select:focus { border-color: #0f3460; }

  .preview-table-wrap { overflow-x: auto; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #f0f4f8; padding: 8px 12px; text-align: left; font-weight: 700; color: #555; white-space: nowrap; }
  td { padding: 8px 12px; border-bottom: 1px solid #f0f4f8; color: #333; white-space: nowrap; }

  .btn-save-roster {
    width: 100%; padding: 13px; background: linear-gradient(135deg, #1a7a3f, #2ecc71);
    color: white; border: none; border-radius: 10px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer;
  }
  .btn-save-roster:hover { opacity: 0.9; }

  /* SESSION SETUP */
  .session-setup-card {
    background: white; border-radius: 16px; padding: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 16px;
  }
  .date-header {
    background: linear-gradient(135deg, #0f3460, #533483);
    color: white; border-radius: 12px; padding: 14px 18px;
    margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;
  }
  .date-header h4 { font-size: 16px; font-weight: 700; }
  .date-header span { font-size: 12px; opacity: 0.7; }
  .slot-row {
    background: #f8fafc; border-radius: 10px; padding: 14px; margin-bottom: 8px;
    border: 1px solid #e8edf2; display: flex; align-items: flex-start; gap: 12px;
  }
  .slot-row-info { flex: 1; }
  .slot-row-time { font-size: 13px; font-weight: 700; color: #0f3460; margin-bottom: 2px; }
  .slot-row-desc { font-size: 13px; color: #555; line-height: 1.5; }
  .btn-delete { background: none; border: none; color: #ccc; cursor: pointer; font-size: 18px; padding: 0 4px; transition: color 0.2s; flex-shrink: 0; }
  .btn-delete:hover { color: #e00; }
  .add-slot-form { background: #f0f4ff; border-radius: 12px; padding: 16px; margin-top: 12px; border: 2px dashed #b0c0e8; }
  .add-slot-form h5 { font-size: 13px; font-weight: 700; color: #0f3460; margin-bottom: 12px; }
  .btn-add-slot {
    padding: 10px 20px; background: #0f3460; color: white; border: none; border-radius: 8px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; margin-top: 10px;
  }
  .btn-add-slot:hover { opacity: 0.85; }
  .btn-add-date {
    width: 100%; padding: 14px; background: white; color: #0f3460;
    border: 2px dashed #b0c0e8; border-radius: 12px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 8px;
  }
  .btn-add-date:hover { background: #f0f4ff; }
  .new-date-form {
    background: white; border-radius: 16px; padding: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 16px; border: 2px solid #0f3460;
  }
  .new-date-form h4 { font-size: 14px; font-weight: 700; color: #0f3460; margin-bottom: 14px; }
  .btn-secondary-sm {
    padding: 10px 16px; background: white; color: #888; border: 1px solid #ddd; border-radius: 8px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 13px; cursor: pointer; margin-top: 10px;
  }

  /* REGISTRATIONS */
  .reg-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .reg-card h3 { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; }

  /* STUDENT */
  .clinic-date-block { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 16px; }
  .clinic-date-head { background: linear-gradient(135deg, #0f3460, #533483); color: white; padding: 14px 18px; }
  .clinic-date-head h3 { font-size: 16px; font-weight: 700; }
  .clinic-date-head span { font-size: 12px; opacity: 0.7; }
  .clinic-slot { padding: 14px 18px; border-bottom: 1px solid #f0f4f8; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: background 0.15s; }
  .clinic-slot:last-child { border-bottom: none; }
  .clinic-slot:hover { background: #f8fafc; }
  .clinic-slot.selected { background: #f0f4ff; }
  .clinic-slot.confirmed { background: #f0fff4; cursor: default; }
  .slot-checkbox { width: 22px; height: 22px; border-radius: 6px; border: 2px solid #ccc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
  .slot-checkbox.checked { background: #0f3460; border-color: #0f3460; color: white; font-size: 13px; }
  .slot-checkbox.done { background: #1a7a3f; border-color: #1a7a3f; color: white; font-size: 13px; }
  .slot-info { flex: 1; }
  .slot-time-label { font-size: 13px; font-weight: 700; color: #0f3460; margin-bottom: 2px; }
  .slot-desc { font-size: 13px; color: #444; line-height: 1.5; }

  .btn-confirm {
    width: 100%; padding: 14px; background: linear-gradient(135deg, #1a7a3f, #2ecc71);
    color: white; border: none; border-radius: 10px;
    font-family: 'Noto Sans KR', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; margin-top: 20px; transition: opacity 0.2s;
  }
  .btn-confirm:hover { opacity: 0.9; }
  .btn-confirm:disabled { opacity: 0.4; cursor: default; }
  .btn-change { width: 100%; padding: 12px; background: white; color: #0f3460; border: 2px solid #0f3460; border-radius: 10px; font-family: 'Noto Sans KR', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 10px; }
  .btn-change:hover { background: #f0f4ff; }
  .btn-cancel-change { width: 100%; padding: 12px; background: white; color: #888; border: 2px solid #ddd; border-radius: 10px; font-family: 'Noto Sans KR', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; margin-top: 8px; }
  .change-notice { background: #fff8e1; border: 1px solid #ffe082; color: #7a5c00; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; line-height: 1.6; }
  .hint { font-size: 12px; color: #aaa; margin-top: 8px; text-align: center; }
  .empty-notice { color: #aaa; font-size: 13px; text-align: center; padding: 32px 0; }
`;

const ADMIN_PHONE = "ella";
const ADMIN_PW = "1234";

const storage = {
  get: async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  set: async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};

export default function App() {
  const [screen, setScreen] = useState("auth");
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Auth
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // Register - step 1: enter phone, step 2: set password
  const [regStep, setRegStep] = useState(1);
  const [regPhone, setRegPhone] = useState("");
  const [regFoundStudent, setRegFoundStudent] = useState(null); // {name, class, studentId, phone}
  const [regPw, setRegPw] = useState("");
  const [regPwConfirm, setRegPwConfirm] = useState("");

  // Admin login
  const [adminPwInput, setAdminPwInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");

  // Admin
  const [adminTab, setAdminTab] = useState("roster");
  const [clinicDates, setClinicDates] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [rosterStudents, setRosterStudents] = useState([]); // [{name, class, studentId, phone}]

  // Manual student entry
  const [manualForm, setManualForm] = useState({ name: "", class: "", studentId: "", phone: "" });
  const [manualSuccess, setManualSuccess] = useState("");

  // Excel upload
  const [xlsRaw, setXlsRaw] = useState(null); // raw rows from excel
  const [xlsHeaders, setXlsHeaders] = useState([]);
  const [colMap, setColMap] = useState({ name: "", class: "", grade: "", studentId: "", phone: "" });
  const [dragOver, setDragOver] = useState(false);

  // Session setup
  const [showNewDateForm, setShowNewDateForm] = useState(false);
  const [newDateVal, setNewDateVal] = useState("");
  const [newDateLabel, setNewDateLabel] = useState("");
  const [newDateSlots, setNewDateSlots] = useState([{ time: "", desc: "" }]);
  const [addSlotForms, setAddSlotForms] = useState({});

  // Twin selection
  const [twinCandidates, setTwinCandidates] = useState([]); // [{name, class, grade, studentId, phone}]

  // Results
  const [slotResults, setSlotResults] = useState({}); // { "dateId_slotId": { type:"score"|"grade"|"note", students:{ phone:{score,total,grade,note} } } }
  const [expandedResult, setExpandedResult] = useState(null); // "dateId_slotId"

  // Student
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [confirmedSlots, setConfirmedSlots] = useState([]);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    storage.get("clinic_dates").then(d => { if (d) setClinicDates(d); });
    storage.get("clinic_roster").then(r => { if (r) setRosterStudents(r); });
    storage.get("clinic_results").then(r => { if (r) setSlotResults(r); });
  }, []);

  const saveClinicDates = async (dates) => { setClinicDates(dates); await storage.set("clinic_dates", dates); };

  // ── MANUAL STUDENT ADD ──
  const handleAddManualStudent = async () => {
    const { name, phone } = manualForm;
    if (!name.trim() || !phone.trim()) { return; }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { return; }
    const roster = await storage.get("clinic_roster") || [];
    if (roster.find(s => s.phone === cleanPhone)) {
      setManualSuccess("error:이미 등록된 학부모 번호입니다."); return;
    }
    const newStudent = { name: manualForm.name.trim(), class: manualForm.class.trim(), grade: (manualForm.grade||"").trim(), studentId: (manualForm.studentId||"").trim(), phone: cleanPhone };
    const updated = [...roster, newStudent];
    await storage.set("clinic_roster", updated);
    setRosterStudents(updated);
    setManualForm({ name: "", class: "", studentId: "", phone: "" });
    setManualSuccess("ok:" + manualForm.name.trim() + " 학생이 추가되었습니다.");
    setTimeout(() => setManualSuccess(""), 3000);
  };

  // ── AUTH ──
  const handleLookupPhone = async () => {
    setError("");
    if (!regPhone || regPhone.length < 10) { setError("올바른 학부모 전화번호를 입력해주세요."); return; }
    const roster = await storage.get("clinic_roster") || [];
    const found = roster.find(s => s.phone.replace(/\D/g,"") === regPhone);
    if (!found) { setError("등록된 학부모 번호가 아닙니다. 선생님께 문의해주세요."); return; }
    const users = await storage.get("clinic_users") || {};
    if (users[regPhone]) { setError("이미 등록된 계정입니다. 로그인해주세요."); return; }
    setRegFoundStudent(found);
    setRegStep(2);
  };

  const handleRegister = async () => {
    setError("");
    if (!regPw || !regPwConfirm) { setError("비밀번호를 입력해주세요."); return; }
    if (regPw !== regPwConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    const users = await storage.get("clinic_users") || {};
    users[regPhone] = { name: regFoundStudent.name, phone: regPhone, class: regFoundStudent.class, studentId: regFoundStudent.studentId, pw: regPw };
    await storage.set("clinic_users", users);
    setSuccessMsg(`${regFoundStudent.name} 학생 등록 완료! 로그인해주세요.`);
    setAuthMode("login"); setRegStep(1); setRegPhone(""); setRegFoundStudent(null); setRegPw(""); setRegPwConfirm("");
  };

  const handleLogin = async () => {
    setError(""); setSuccessMsg("");
    if (!loginPhone || !loginPw) { setError("학부모 번호와 비밀번호를 입력해주세요."); return; }
    if (loginPhone === ADMIN_PHONE && loginPw === ADMIN_PW) {
      const [regs, dates, roster] = await Promise.all([
        storage.get("clinic_regs"), storage.get("clinic_dates"), storage.get("clinic_roster")
      ]);
      setAllRegistrations(regs || []); setClinicDates(dates || []); setRosterStudents(roster || []);
      setCurrentUser({ name: "관리자", isAdmin: true });
      setScreen("admin"); return;
    }
    setLoading(true);
    const users = await storage.get("clinic_users") || {};
    const user = users[loginPhone];
    if (!user || user.pw !== loginPw) { setError("학부모 번호 또는 비밀번호가 올바르지 않습니다."); setLoading(false); return; }
    const [saved, dates] = await Promise.all([storage.get(`clinic_reg_${loginPhone}`), storage.get("clinic_dates")]);
    setConfirmedSlots(saved || []); setClinicDates(dates || []);
    setCurrentUser(user); setScreen("student"); setLoading(false);
  };

  const handleLogout = () => {
    setScreen("auth"); setCurrentUser(null);
    setLoginPhone(""); setLoginPw("");
    setTwinCandidates([]);
    setSelectedSlots([]); setConfirmedSlots([]);
    setIsChanging(false); setError(""); setSuccessMsg("");

    setAdminPwInput(""); setAdminLoginError("");
  };

  // ── EXCEL ──
  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (rows.length < 2) return;
      const headers = rows[0].map(String);
      const data = rows.slice(1).filter(r => r.some(c => c !== undefined && c !== ""));
      setXlsHeaders(headers);
      setXlsRaw(data);
      // Auto-detect columns by common keyword matching
      const autoMap = { name: "", class: "", grade: "", studentId: "", phone: "" };
      headers.forEach((h, i) => {
        const lh = h.toLowerCase();
        if (!autoMap.name && (lh.includes("이름") || lh === "name")) autoMap.name = String(i);
        if (!autoMap.grade && (lh === "학년" || lh.includes("grade"))) autoMap.grade = String(i);
        // 수강반1, 반명 등
        if (!autoMap.class && (lh.includes("수강반") || lh.includes("반명") || lh === "class")) autoMap.class = String(i);
        // 학생 연락처 → 학생번호로 사용
        if (!autoMap.studentId && (lh.includes("학생") && lh.includes("연락"))) autoMap.studentId = String(i);
        // 학부모 연락처 → 로그인 번호
        if (!autoMap.phone && (lh.includes("학부모") || lh.includes("부모") || lh.includes("phone"))) autoMap.phone = String(i);
        if (!autoMap.phone && lh.includes("전화")) autoMap.phone = String(i);
      });
      setColMap(autoMap);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) parseExcel(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) parseExcel(file);
  };

  const handleSaveRoster = async () => {
    if (!xlsRaw || !colMap.name || !colMap.phone) { return; }
    const students = xlsRaw.map(row => ({
      name: String(row[parseInt(colMap.name)] || "").trim(),
      class: colMap.class !== "" ? String(row[parseInt(colMap.class)] || "").trim() : "",
      grade: colMap.grade !== "" ? String(row[parseInt(colMap.grade)] || "").trim() : "",
      studentId: colMap.studentId !== "" ? String(row[parseInt(colMap.studentId)] || "").replace(/\D/g,"") : "",
      phone: String(row[parseInt(colMap.phone)] || "").replace(/\D/g, ""),
    })).filter(s => s.name && s.phone);
    await storage.set("clinic_roster", students);
    setRosterStudents(students);
    setXlsRaw(null); setXlsHeaders([]); setColMap({ name: "", class: "", studentId: "", phone: "" });
    setSuccessMsg(`✅ ${students.length}명 학생 명단이 저장되었습니다.`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ── SESSIONS ──
  const handleAddDate = async () => {
    if (!newDateLabel.trim()) return;
    const id = "d_" + Date.now();
    const filledSlots = newDateSlots
      .filter(s => s.time.trim() && s.desc.trim())
      .map(s => ({ id: "s_" + Date.now() + Math.random(), time: s.time, desc: s.desc }));
    await saveClinicDates([...clinicDates, { id, date: newDateVal, label: newDateLabel, slots: filledSlots }]);
    setNewDateVal(""); setNewDateLabel(""); setNewDateSlots([{ time: "", desc: "" }]); setShowNewDateForm(false);
  };
  const handleDeleteDate = async (dateId) => await saveClinicDates(clinicDates.filter(d => d.id !== dateId));
  const getSlotForm = (dateId) => addSlotForms[dateId] || { time: "", desc: "" };
  const setSlotForm = (dateId, val) => setAddSlotForms(prev => ({ ...prev, [dateId]: val }));
  const handleAddSlot = async (dateId) => {
    const form = getSlotForm(dateId);
    if (!form.time || !form.desc) return;
    const slotId = "s_" + Date.now();
    await saveClinicDates(clinicDates.map(d => d.id === dateId ? { ...d, slots: [...d.slots, { id: slotId, time: form.time, desc: form.desc }] } : d));
    setSlotForm(dateId, { time: "", desc: "" });
  };
  const handleDeleteSlot = async (dateId, slotId) =>
    await saveClinicDates(clinicDates.map(d => d.id === dateId ? { ...d, slots: d.slots.filter(s => s.id !== slotId) } : d));

  const updateNewDateSlot = (i, field, val) => setNewDateSlots(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const addNewDateSlotRow = () => setNewDateSlots(prev => [...prev, { time: "", desc: "" }]);
  const removeNewDateSlotRow = (i) => setNewDateSlots(prev => prev.filter((_, idx) => idx !== i));

  // ── STUDENT ──
  const isSelected = (dateId, slotId) => selectedSlots.some(s => s.dateId === dateId && s.slotId === slotId);
  const isConfirmed = (dateId, slotId) => confirmedSlots.some(s => s.dateId === dateId && s.slotId === slotId);
  const toggleSlot = (dateId, slotId) => {
    if (isSelected(dateId, slotId)) setSelectedSlots(prev => prev.filter(s => !(s.dateId === dateId && s.slotId === slotId)));
    else setSelectedSlots(prev => [...prev, { dateId, slotId }]);
  };
  const handleConfirm = async () => {
    if (selectedSlots.length === 0) return;
    const regKey = currentUser.regKey || currentUser.phone;
    await storage.set(`clinic_reg_${regKey}`, selectedSlots);
    const regs = await storage.get("clinic_regs") || [];
    const filtered = regs.filter(r => (r.regKey || r.phone) !== regKey);
    await storage.set("clinic_regs", [...filtered, { name: currentUser.name, phone: currentUser.phone, regKey, class: currentUser.class, grade: currentUser.grade, studentId: currentUser.studentId, slots: selectedSlots, date: new Date().toLocaleDateString("ko-KR"), changed: isChanging }]);
    setConfirmedSlots(selectedSlots); setSelectedSlots([]); setIsChanging(false);
  };

  const getSlotLabel = (dateId, slotId) => {
    const d = clinicDates.find(x => x.id === dateId);
    const s = d?.slots.find(x => x.id === slotId);
    return d && s ? `${d.label} ${s.time}` : "";
  };
  const countForSlot = (dateId, slotId) =>
    allRegistrations.filter(r => r.slots.some(s => s.dateId === dateId && s.slotId === slotId)).length;

  const refreshAdminData = async () => {
    const [regs, dates, roster, results] = await Promise.all([storage.get("clinic_regs"), storage.get("clinic_dates"), storage.get("clinic_roster"), storage.get("clinic_results")]);
    setAllRegistrations(regs || []); setClinicDates(dates || []); setRosterStudents(roster || []); setSlotResults(results || {});
  };

  const saveResults = async (updated) => {
    setSlotResults(updated);
    await storage.set("clinic_results", updated);
  };

  const getSlotKey = (dateId, slotId) => dateId + "_" + slotId;

  const updateStudentResult = (dateId, slotId, phone, field, value) => {
    const key = getSlotKey(dateId, slotId);
    const current = slotResults[key] || { type: "score", students: {} };
    const updated = {
      ...slotResults,
      [key]: {
        ...current,
        students: {
          ...current.students,
          [phone]: { ...(current.students[phone] || {}), [field]: value }
        }
      }
    };
    setSlotResults(updated);
  };

  const updateSlotResultType = (dateId, slotId, type) => {
    const key = getSlotKey(dateId, slotId);
    const current = slotResults[key] || { type: "score", students: {} };
    setSlotResults(prev => ({ ...prev, [key]: { ...current, type } }));
  };

  const handleSaveSlotResults = async (dateId, slotId) => {
    const key = getSlotKey(dateId, slotId);
    const updated = { ...slotResults };
    if (!updated[key]) updated[key] = { type: "score", students: {} };
    await saveResults(updated);
    setExpandedResult(null);
  };

  // ── RENDER ──

  if (screen === "admin") return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="topbar">
          <div><div className="topbar-title">관리자 페이지</div><div className="topbar-sub">삼보어학원 H-Inter · 수요 클리닉</div></div>
          <button className="btn-logout" onClick={handleLogout}>로그아웃</button>
        </div>
        <div className="body">
          {successMsg && <div className="success" style={{marginBottom:"16px"}}>{successMsg}</div>}
          <div className="admin-tabs">
            {[["roster","👥 학생 명단"],["sessions","📅 수업 설정"],["registrations","📋 신청 현황"]].map(([key,label]) => (
              <button key={key} className={`admin-tab ${adminTab===key?"active":""}`}
                onClick={async () => { await refreshAdminData(); setAdminTab(key); }}>{label}</button>
            ))}
          </div>

          {/* ── 학생 명단 탭 ── */}
          {adminTab === "roster" && (
            <>
              {/* Manual add */}
              <div className="roster-card">
                <h3>학생 직접 추가</h3>
                <p className="roster-sub">신규 학생을 수동으로 명단에 추가합니다.</p>
                {manualSuccess && (
                  <div className={manualSuccess.startsWith("error:") ? "error" : "success"} style={{marginBottom:"12px"}}>
                    {manualSuccess.startsWith("error:") ? "⚠️ " : "✅ "}{manualSuccess.replace(/^(ok:|error:)/,"")}
                  </div>
                )}
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"12px"}}>
                  {[["학생 이름 *","name","홍길동","text"],["학부모 번호 *","phone","01012345678","tel"]].map(([lbl,key,ph,type]) => (
                    <div key={key}>
                      <div style={{fontSize:"11px",fontWeight:"700",color:"#555",marginBottom:"4px"}}>{lbl}</div>
                      <input type={type} placeholder={ph}
                        style={{width:"100%",padding:"10px 12px",border:"2px solid #e8edf2",borderRadius:"8px",fontFamily:"inherit",fontSize:"13px",outline:"none",transition:"border-color 0.2s"}}
                        value={manualForm[key]}
                        onChange={e => setManualForm(prev => ({...prev, [key]: type==="tel" ? e.target.value.replace(/\D/g,"") : e.target.value}))}
                        onFocus={e => e.target.style.borderColor="#0f3460"}
                        onBlur={e => e.target.style.borderColor="#e8edf2"}
                      />
                    </div>
                  ))}
                  <div>
                    <div style={{fontSize:"11px",fontWeight:"700",color:"#555",marginBottom:"4px"}}>반명</div>
                    <select
                      style={{width:"100%",padding:"10px 12px",border:"2px solid #e8edf2",borderRadius:"8px",fontFamily:"inherit",fontSize:"13px",outline:"none",background:"white",color: manualForm.class ? "#1a1a2e" : "#aaa"}}
                      value={manualForm.class}
                      onChange={e => setManualForm(prev => ({...prev, class: e.target.value}))}
                      onFocus={e => e.target.style.borderColor="#0f3460"}
                      onBlur={e => e.target.style.borderColor="#e8edf2"}
                    >
                      <option value="">— 선택 —</option>
                      <option value="월금 4:50">월금 4:50</option>
                      <option value="월금 7:30">월금 7:30</option>
                      <option value="화목 4:50">화목 4:50</option>
                      <option value="화목 7:30">화목 7:30</option>
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:"11px",fontWeight:"700",color:"#555",marginBottom:"4px"}}>학년</div>
                    <input type="text" placeholder="예: 중3"
                      style={{width:"100%",padding:"10px 12px",border:"2px solid #e8edf2",borderRadius:"8px",fontFamily:"inherit",fontSize:"13px",outline:"none",transition:"border-color 0.2s"}}
                      value={manualForm.grade||""}
                      onChange={e => setManualForm(prev => ({...prev, grade: e.target.value}))}
                      onFocus={e => e.target.style.borderColor="#0f3460"}
                      onBlur={e => e.target.style.borderColor="#e8edf2"}
                    />
                  </div>
                  <div>
                    <div style={{fontSize:"11px",fontWeight:"700",color:"#555",marginBottom:"4px"}}>학생번호 (학생 연락처)</div>
                    <input type="tel" placeholder="01012345678"
                      style={{width:"100%",padding:"10px 12px",border:"2px solid #e8edf2",borderRadius:"8px",fontFamily:"inherit",fontSize:"13px",outline:"none",transition:"border-color 0.2s"}}
                      value={manualForm.studentId||""}
                      onChange={e => setManualForm(prev => ({...prev, studentId: e.target.value.replace(/\D/g,"")}))}
                      onFocus={e => e.target.style.borderColor="#0f3460"}
                      onBlur={e => e.target.style.borderColor="#e8edf2"}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddManualStudent}
                  disabled={!manualForm.name.trim() || manualForm.phone.replace(/\D/g,"").length < 10}
                  style={{padding:"11px 24px",background:"linear-gradient(135deg,#0f3460,#533483)",color:"white",border:"none",borderRadius:"9px",fontFamily:"inherit",fontSize:"13px",fontWeight:"700",cursor:"pointer",opacity:(!manualForm.name.trim()||manualForm.phone.replace(/\D/g,"").length<10)?0.4:1}}>
                  + 학생 추가
                </button>
              </div>

              {/* Upload zone */}
              {!xlsRaw && (
                <div className="roster-card">
                  <h3>학생 명단 업로드</h3>
                  <p className="roster-sub">엑셀 파일(.xlsx, .xls)을 업로드하면 학부모 번호를 기준으로 최초 등록이 가능해집니다.</p>
                  <div
                    className={`upload-zone ${dragOver ? "dragging" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => document.getElementById("xls-input").click()}
                  >
                    <div className="upload-icon">📊</div>
                    <div className="upload-title">엑셀 파일을 끌어다 놓거나 클릭하여 선택</div>
                    <div className="upload-sub">.xlsx, .xls 파일 지원</div>
                    <input id="xls-input" type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={handleFileInput} />
                  </div>
                </div>
              )}

              {/* Column mapping */}
              {xlsRaw && (
                <div className="roster-card">
                  <h3>열 매핑 설정</h3>
                  <p className="roster-sub">엑셀의 어떤 열이 어떤 정보인지 선택해주세요.</p>
                  <div className="col-map">
                    <h4>🗂 열 매핑</h4>
                    <div className="col-map-grid">
                      {[["name","학생이름 *"],["phone","학부모 번호 *"],["class","반명"],["grade","학년"],["studentId","학생번호 (학생 연락처)"]].map(([key, lbl]) => (
                        <div className="col-map-item" key={key}>
                          <label>{lbl}</label>
                          <select value={colMap[key]} onChange={e => setColMap(prev => ({...prev, [key]: e.target.value}))}>
                            <option value="">— 선택 —</option>
                            {xlsHeaders.map((h, i) => <option key={i} value={String(i)}>{h}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="preview-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          {["학생이름","학부모 번호","반명","학년","학생번호"].map(h => <th key={h}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {xlsRaw.slice(0, 5).map((row, i) => (
                          <tr key={i}>
                            <td>{colMap.name !== "" ? row[parseInt(colMap.name)] || "-" : "-"}</td>
                            <td>{colMap.phone !== "" ? String(row[parseInt(colMap.phone)] || "").replace(/\D/g,"") || "-" : "-"}</td>
                            <td>{colMap.class !== "" ? row[parseInt(colMap.class)] || "-" : "-"}</td>
                            <td>{colMap.grade !== "" ? row[parseInt(colMap.grade)] || "-" : "-"}</td>
                            <td>{colMap.studentId !== "" ? String(row[parseInt(colMap.studentId)] || "").replace(/\D/g,"") || "-" : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {xlsRaw.length > 5 && <p style={{fontSize:"12px",color:"#aaa",textAlign:"center",marginTop:"8px"}}>외 {xlsRaw.length - 5}명 더...</p>}
                  </div>
                  <button className="btn-save-roster" onClick={handleSaveRoster} disabled={!colMap.name || !colMap.phone}>
                    💾 {xlsRaw.length}명 명단 저장하기
                  </button>
                  <button className="btn-secondary-sm" style={{width:"100%",textAlign:"center",marginTop:"8px"}} onClick={() => { setXlsRaw(null); setXlsHeaders([]); }}>취소</button>
                </div>
              )}

              {/* Current roster */}
              {rosterStudents.length > 0 && !xlsRaw && (
                <div className="roster-card">
                  <h3>현재 등록된 학생 명단</h3>
                  <p className="roster-sub">총 {rosterStudents.length}명 · 새 엑셀을 업로드하면 덮어씌워집니다.</p>
                  <div className="preview-table-wrap">
                    <table>
                      <thead><tr><th>이름</th><th>반명</th><th>학년</th><th>학생번호</th><th>학부모 번호</th><th></th></tr></thead>
                      <tbody>
                        {rosterStudents.map((s, i) => (
                          <tr key={i}>
                            <td>{s.name}</td><td>{s.class||"-"}</td><td>{s.grade||"-"}</td><td>{s.studentId||"-"}</td><td>{s.phone}</td>
                            <td>
                              <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                                <button onClick={async () => {
                                  if (!window.confirm(`${s.name} 학생의 비밀번호를 초기화할까요?\n기존 신청 내역은 유지됩니다.`)) return;
                                  const users = await storage.get("clinic_users") || {};
                                  if (users[s.phone]) {
                                    delete users[s.phone];
                                    await storage.set("clinic_users", users);
                                  }
                                  setManualSuccess("ok:" + s.name + " 학생 비밀번호가 초기화되었습니다.");
                                  setTimeout(() => setManualSuccess(""), 3000);
                                }} style={{background:"#fff8e1",border:"1px solid #ffe082",color:"#b8860b",fontSize:"11px",fontWeight:"700",padding:"4px 8px",borderRadius:"6px",cursor:"pointer",whiteSpace:"nowrap"}}>
                                  🔑 초기화
                                </button>
                                <button onClick={async () => {
                                  const updated = rosterStudents.filter((_,idx) => idx !== i);
                                  await storage.set("clinic_roster", updated);
                                  setRosterStudents(updated);
                                }} style={{background:"none",border:"none",color:"#ccc",fontSize:"16px",cursor:"pointer"}} title="삭제">✕</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {rosterStudents.length === 0 && !xlsRaw && (
                <div className="empty-notice" style={{marginTop:"8px"}}>아직 업로드된 학생 명단이 없습니다.</div>
              )}
            </>
          )}

          {/* ── 수업 설정 탭 ── */}
          {adminTab === "sessions" && (
            <>
              {clinicDates.length === 0 && !showNewDateForm && <div className="empty-notice">아직 설정된 수업 일정이 없습니다.</div>}
              {clinicDates.map(d => (
                <div key={d.id} className="session-setup-card">
                  <div className="date-header">
                    <div><h4>{d.label}</h4><span>{d.date}</span></div>
                    <button className="btn-delete" onClick={() => handleDeleteDate(d.id)}>✕</button>
                  </div>
                  {d.slots.map(s => {
                    const count = countForSlot(d.id, s.id);
                    return (
                      <div key={s.id} className="slot-row">
                        <div className="slot-row-info">
                          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
                            <div className="slot-row-time">⏰ {s.time}</div>
                            <span style={{background:count>0?"#0f3460":"#e8edf2",color:count>0?"white":"#aaa",fontSize:"11px",fontWeight:"700",padding:"2px 8px",borderRadius:"20px"}}>{count}명 신청</span>
                          </div>
                          <div className="slot-row-desc">{s.desc}</div>
                        </div>
                        <button className="btn-delete" onClick={() => handleDeleteSlot(d.id, s.id)}>✕</button>
                      </div>
                    );
                  })}
                  <div className="add-slot-form">
                    <h5>+ 시간대 추가</h5>
                    <div style={{marginBottom:"10px"}}>
                      <div style={{fontSize:"11px",fontWeight:"700",color:"#555",marginBottom:"4px"}}>시간</div>
                      <input type="text" placeholder="예: 4-6시" value={getSlotForm(d.id).time}
                        style={{width:"100%",padding:"10px 12px",border:"2px solid #e8edf2",borderRadius:"8px",fontFamily:"inherit",fontSize:"13px",outline:"none"}}
                        onChange={e => setSlotForm(d.id, { ...getSlotForm(d.id), time: e.target.value })} />
                    </div>
                    <div>
                      <div style={{fontSize:"11px",fontWeight:"700",color:"#555",marginBottom:"4px"}}>수업 내용</div>
                      <textarea placeholder="예: 2026 3월 고1 모의고사 실전연습 및 풀이" value={getSlotForm(d.id).desc}
                        style={{width:"100%",padding:"10px 12px",border:"2px solid #e8edf2",borderRadius:"8px",fontFamily:"inherit",fontSize:"13px",outline:"none",resize:"vertical",minHeight:"70px"}}
                        onChange={e => setSlotForm(d.id, { ...getSlotForm(d.id), desc: e.target.value })} />
                    </div>
                    <button className="btn-add-slot" onClick={() => handleAddSlot(d.id)}>추가하기</button>
                  </div>
                </div>
              ))}
              {showNewDateForm ? (
                <div className="new-date-form">
                  <h4>📅 새 날짜 추가</h4>
                  <div className="field"><label>날짜 표기 (예: 5/6 수요일)</label>
                    <input type="text" placeholder="5/6 수요일" value={newDateLabel} onChange={e => setNewDateLabel(e.target.value)} />
                  </div>
                  <div className="field"><label>날짜 (정렬용)</label>
                    <input type="date" value={newDateVal} onChange={e => setNewDateVal(e.target.value)} />
                  </div>
                  <div style={{marginTop:"14px",marginBottom:"6px",fontSize:"12px",fontWeight:"700",color:"#0f3460"}}>⏰ 시간대 및 수업 내용</div>
                  {newDateSlots.map((s, i) => (
                    <div key={i} style={{background:"#f8fafc",border:"1px solid #e0e8f0",borderRadius:"10px",padding:"12px",marginBottom:"8px"}}>
                      <div style={{display:"flex",alignItems:"flex-start",gap:"8px"}}>
                        <div style={{flex:"0 0 90px"}}>
                          <div style={{fontSize:"11px",fontWeight:"700",color:"#555",marginBottom:"4px"}}>시간</div>
                          <input type="text" placeholder="4-6시"
                            style={{width:"100%",padding:"8px 10px",border:"2px solid #e8edf2",borderRadius:"8px",fontFamily:"inherit",fontSize:"13px",outline:"none"}}
                            value={s.time} onChange={e => updateNewDateSlot(i, "time", e.target.value)} />
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:"11px",fontWeight:"700",color:"#555",marginBottom:"4px"}}>수업 내용</div>
                          <input type="text" placeholder="예: 3월 고1 모의고사 풀이"
                            style={{width:"100%",padding:"8px 10px",border:"2px solid #e8edf2",borderRadius:"8px",fontFamily:"inherit",fontSize:"13px",outline:"none"}}
                            value={s.desc} onChange={e => updateNewDateSlot(i, "desc", e.target.value)} />
                        </div>
                        {newDateSlots.length > 1 && (
                          <button onClick={() => removeNewDateSlotRow(i)} style={{background:"none",border:"none",color:"#ccc",fontSize:"18px",cursor:"pointer",paddingTop:"20px"}}>✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button onClick={addNewDateSlotRow} style={{width:"100%",padding:"9px",background:"white",border:"2px dashed #b0c0e8",borderRadius:"8px",color:"#0f3460",fontFamily:"inherit",fontSize:"13px",fontWeight:"700",cursor:"pointer",marginBottom:"12px"}}>+ 시간대 추가</button>
                  <div style={{display:"flex",gap:"8px"}}>
                    <button className="btn-add-slot" onClick={handleAddDate}>저장</button>
                    <button className="btn-secondary-sm" onClick={() => { setShowNewDateForm(false); setNewDateSlots([{time:"",desc:""}]); }}>취소</button>
                  </div>
                </div>
              ) : (
                <button className="btn-add-date" onClick={() => setShowNewDateForm(true)}>+ 새 날짜 추가</button>
              )}
            </>
          )}

          {/* ── 신청 현황 탭 ── */}
          {adminTab === "registrations" && (
            <>
              {/* 전체 요약 */}
              <div className="reg-card" style={{marginBottom:"16px"}}>
                <h3>📋 전체 신청 현황 ({allRegistrations.length}명)</h3>
                {allRegistrations.length === 0 ? <div className="empty-notice">아직 신청한 학생이 없습니다.</div> : (
                  <div style={{overflowX:"auto"}}>
                    <table>
                      <thead><tr><th>이름</th><th>반명</th><th>학년</th><th>학생번호</th><th>학부모 번호</th><th>신청일</th><th>비고</th></tr></thead>
                      <tbody>
                        {allRegistrations.map((r, i) => (
                          <tr key={i}>
                            <td>{r.name}</td>
                            <td>{r.class||"-"}</td>
                            <td>{r.studentId||"-"}</td>
                            <td>{r.phone}</td>
                            <td>{r.date}</td>
                            <td>{r.changed?"✏️ 변경":"최초"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 수업별 신청자 목록 */}
              {clinicDates.map(d => (
                <div key={d.id} style={{background:"white", borderRadius:"16px", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:"16px"}}>
                  <div style={{background:"linear-gradient(135deg,#0f3460,#533483)", color:"white", padding:"14px 20px"}}>
                    <div style={{fontSize:"16px", fontWeight:"700"}}>{d.label}</div>
                    <div style={{fontSize:"12px", opacity:"0.7", marginTop:"2px"}}>{d.date}</div>
                  </div>
                  {d.slots.map(s => {
                    const applicants = allRegistrations.filter(r => r.slots.some(sl => sl.dateId === d.id && sl.slotId === s.id));
                    return (
                      <div key={s.id} style={{borderBottom:"1px solid #f0f4f8"}}>
                        <div style={{padding:"12px 20px", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                          <div>
                            <div style={{fontSize:"13px", fontWeight:"700", color:"#0f3460"}}>⏰ {s.time}</div>
                            <div style={{fontSize:"12px", color:"#666", marginTop:"2px"}}>{s.desc}</div>
                          </div>
                          <span style={{background: applicants.length > 0 ? "#0f3460" : "#e8edf2", color: applicants.length > 0 ? "white" : "#aaa", fontSize:"12px", fontWeight:"700", padding:"4px 12px", borderRadius:"20px", flexShrink:0}}>
                            {applicants.length}명
                          </span>
                        </div>
                        {applicants.length > 0 ? (() => {
                          const key = getSlotKey(d.id, s.id);
                          const slotData = slotResults[key] || { type: "score", students: {} };
                          const isOpen = expandedResult === key;
                          return (
                            <div style={{padding:"0 20px 16px"}}>
                              {/* Student list */}
                              <table style={{marginTop:"10px", marginBottom:"12px"}}>
                                <thead>
                                  <tr>
                                    <th style={{fontSize:"11px"}}>이름</th>
                                    <th style={{fontSize:"11px"}}>반명</th>
                                    <th style={{fontSize:"11px"}}>학년</th>
                                    <th style={{fontSize:"11px"}}>학생번호</th>
                                    <th style={{fontSize:"11px"}}>학부모 번호</th>
                                    {slotData.type === "score" && <><th style={{fontSize:"11px",color:"#0f3460"}}>점수</th><th style={{fontSize:"11px",color:"#0f3460"}}>총점</th></>}
                                    {slotData.type === "grade" && <th style={{fontSize:"11px",color:"#0f3460"}}>등급</th>}
                                    {slotData.type === "note" && <th style={{fontSize:"11px",color:"#0f3460"}}>메모</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {applicants.map((r, i) => {
                                    const res = slotData.students[r.phone] || {};
                                    return (
                                      <tr key={i}>
                                        <td style={{fontSize:"13px"}}>{r.name}</td>
                                        <td style={{fontSize:"13px"}}>{r.class||"-"}</td>
                                        <td style={{fontSize:"13px"}}>{r.grade||"-"}</td>
                                        <td style={{fontSize:"13px"}}>{r.studentId||"-"}</td>
                                        <td style={{fontSize:"13px"}}>{r.phone}</td>
                                        {slotData.type === "score" && <>
                                          <td style={{fontSize:"13px", color: res.score ? "#0f3460" : "#ccc", fontWeight:"700"}}>{res.score || "-"}</td>
                                          <td style={{fontSize:"13px", color:"#888"}}>{res.total ? `/ ${res.total}` : "-"}</td>
                                        </>}
                                        {slotData.type === "grade" && <td style={{fontSize:"13px", color: res.grade ? "#0f3460" : "#ccc", fontWeight:"700"}}>{res.grade || "-"}</td>}
                                        {slotData.type === "note" && <td style={{fontSize:"13px", color:"#555"}}>{res.note || "-"}</td>}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>

                              {/* Result entry toggle */}
                              {!isOpen ? (
                                <button onClick={() => setExpandedResult(key)}
                                  style={{padding:"8px 16px", background:"#f0f4ff", color:"#0f3460", border:"2px solid #b0c4f0", borderRadius:"8px", fontFamily:"inherit", fontSize:"12px", fontWeight:"700", cursor:"pointer"}}>
                                  ✏️ 결과 입력
                                </button>
                              ) : (
                                <div style={{background:"#f8faff", border:"2px solid #b0c4f0", borderRadius:"12px", padding:"16px", marginTop:"4px"}}>
                                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px"}}>
                                    <div style={{fontSize:"13px", fontWeight:"700", color:"#0f3460"}}>📝 결과 입력</div>
                                    <div style={{display:"flex", gap:"6px"}}>
                                      {[["score","점수/총점"],["grade","등급"],["note","메모"]].map(([t,lbl]) => (
                                        <button key={t} onClick={() => updateSlotResultType(d.id, s.id, t)}
                                          style={{padding:"5px 10px", background: slotData.type===t ? "#0f3460" : "white", color: slotData.type===t ? "white" : "#888", border:"2px solid", borderColor: slotData.type===t ? "#0f3460" : "#e0e0e0", borderRadius:"6px", fontFamily:"inherit", fontSize:"11px", fontWeight:"700", cursor:"pointer"}}>
                                          {lbl}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  {applicants.map((r, i) => {
                                    const res = slotData.students[r.phone] || {};
                                    return (
                                      <div key={i} style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px", background:"white", borderRadius:"8px", padding:"10px 12px", border:"1px solid #e8edf2"}}>
                                        <div style={{width:"60px", fontSize:"13px", fontWeight:"700", color:"#1a1a2e", flexShrink:0}}>{r.name}</div>
                                        <div style={{fontSize:"12px", color:"#888", width:"60px", flexShrink:0}}>{r.class||""}</div>
                                        {slotData.type === "score" && (
                                          <div style={{display:"flex", alignItems:"center", gap:"6px", flex:1}}>
                                            <input type="number" placeholder="점수" value={res.score||""}
                                              onChange={e => updateStudentResult(d.id, s.id, r.phone, "score", e.target.value)}
                                              style={{width:"70px", padding:"7px 10px", border:"2px solid #e8edf2", borderRadius:"7px", fontFamily:"inherit", fontSize:"13px", outline:"none", textAlign:"center"}}
                                              onFocus={e => e.target.style.borderColor="#0f3460"} onBlur={e => e.target.style.borderColor="#e8edf2"} />
                                            <span style={{color:"#aaa", fontSize:"13px"}}>/</span>
                                            <input type="number" placeholder="총점" value={res.total||""}
                                              onChange={e => updateStudentResult(d.id, s.id, r.phone, "total", e.target.value)}
                                              style={{width:"70px", padding:"7px 10px", border:"2px solid #e8edf2", borderRadius:"7px", fontFamily:"inherit", fontSize:"13px", outline:"none", textAlign:"center"}}
                                              onFocus={e => e.target.style.borderColor="#0f3460"} onBlur={e => e.target.style.borderColor="#e8edf2"} />
                                          </div>
                                        )}
                                        {slotData.type === "grade" && (
                                          <input type="text" placeholder="등급 (예: 2등급)" value={res.grade||""}
                                            onChange={e => updateStudentResult(d.id, s.id, r.phone, "grade", e.target.value)}
                                            style={{flex:1, padding:"7px 10px", border:"2px solid #e8edf2", borderRadius:"7px", fontFamily:"inherit", fontSize:"13px", outline:"none"}}
                                            onFocus={e => e.target.style.borderColor="#0f3460"} onBlur={e => e.target.style.borderColor="#e8edf2"} />
                                        )}
                                        {slotData.type === "note" && (
                                          <input type="text" placeholder="메모" value={res.note||""}
                                            onChange={e => updateStudentResult(d.id, s.id, r.phone, "note", e.target.value)}
                                            style={{flex:1, padding:"7px 10px", border:"2px solid #e8edf2", borderRadius:"7px", fontFamily:"inherit", fontSize:"13px", outline:"none"}}
                                            onFocus={e => e.target.style.borderColor="#0f3460"} onBlur={e => e.target.style.borderColor="#e8edf2"} />
                                        )}
                                      </div>
                                    );
                                  })}
                                  <div style={{display:"flex", gap:"8px", marginTop:"4px"}}>
                                    <button onClick={() => handleSaveSlotResults(d.id, s.id)}
                                      style={{padding:"9px 20px", background:"linear-gradient(135deg,#1a7a3f,#2ecc71)", color:"white", border:"none", borderRadius:"8px", fontFamily:"inherit", fontSize:"13px", fontWeight:"700", cursor:"pointer"}}>
                                      💾 저장
                                    </button>
                                    <button onClick={() => setExpandedResult(null)}
                                      style={{padding:"9px 16px", background:"white", color:"#888", border:"1px solid #ddd", borderRadius:"8px", fontFamily:"inherit", fontSize:"13px", cursor:"pointer"}}>
                                      닫기
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })() : (
                          <div style={{padding:"12px 20px", fontSize:"12px", color:"#bbb"}}>아직 신청자가 없습니다.</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              {clinicDates.length === 0 && <div className="empty-notice">설정된 수업 일정이 없습니다.</div>}
            </>
          )}
        </div>
      </div>
    </>
  );

  if (screen === "student") return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="topbar">
          <div><div className="topbar-title">수요 클리닉 신청</div><div className="topbar-sub">{currentUser?.name} 학생 · {currentUser?.class || "H-Inter"}</div></div>
          <button className="btn-logout" onClick={handleLogout}>로그아웃</button>
        </div>
        <div className="body">
          <div className="welcome-card">
            <h2>안녕하세요, {currentUser?.name} 학생! 👋</h2>
            <p>참여할 수요 클리닉 수업을 선택해 신청해주세요.</p>
          </div>
          {confirmedSlots.length > 0 && !isChanging && (
            <div className="change-notice" style={{background:"#f0fff4",borderColor:"#b2f5c8",color:"#1a7a3f",marginBottom:"16px"}}>✅ 신청이 완료되었습니다. 변경이 필요하면 아래 버튼을 눌러주세요.</div>
          )}
          {isChanging && <div className="change-notice">✏️ 수업을 다시 선택 후 <strong>변경 확정하기</strong>를 눌러주세요.</div>}
          {clinicDates.length === 0 ? <div className="empty-notice">현재 등록된 수업 일정이 없습니다.<br/>선생님께 문의해주세요.</div> : (
            clinicDates.map(d => (
              <div key={d.id} className="clinic-date-block">
                <div className="clinic-date-head"><h3>{d.label}</h3><span>{d.date}</span></div>
                {d.slots.map(s => {
                  const confirmed = isConfirmed(d.id, s.id);
                  const selected = isSelected(d.id, s.id);
                  const clickable = isChanging || confirmedSlots.length === 0;
                  return (
                    <div key={s.id} className={`clinic-slot ${selected?"selected":""} ${confirmed&&!isChanging?"confirmed":""}`}
                      onClick={() => clickable && toggleSlot(d.id, s.id)}>
                      <div className={`slot-checkbox ${selected?"checked":confirmed&&!isChanging?"done":""}`}>{(selected||(confirmed&&!isChanging))&&"✓"}</div>
                      <div className="slot-info">
                        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"2px"}}>
                          <div className="slot-time-label">⏰ {s.time}</div>
                          {confirmed && !isChanging && (
                            <span style={{background:"#1a7a3f",color:"white",fontSize:"11px",fontWeight:"700",padding:"2px 8px",borderRadius:"20px"}}>신청완료</span>
                          )}
                          {selected && isChanging && (
                            <span style={{background:"#0f3460",color:"white",fontSize:"11px",fontWeight:"700",padding:"2px 8px",borderRadius:"20px"}}>선택됨</span>
                          )}
                        </div>
                        <div className="slot-desc">{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          {(confirmedSlots.length === 0 || isChanging) && clinicDates.length > 0 && (
            <>
              <button className="btn-confirm" disabled={selectedSlots.length === 0} onClick={handleConfirm}>
                {selectedSlots.length > 0 ? `${selectedSlots.length}개 수업 ${isChanging?"변경 확정하기":"신청하기"}` : "수업을 선택해주세요"}
              </button>
              {isChanging && <button className="btn-cancel-change" onClick={() => { setSelectedSlots([]); setIsChanging(false); }}>취소</button>}
              <p className="hint">여러 수업을 중복 선택할 수 있습니다.</p>
            </>
          )}
          {confirmedSlots.length > 0 && !isChanging && (
            <button className="btn-change" onClick={() => { setSelectedSlots([...confirmedSlots]); setIsChanging(true); }}>✏️ 신청 변경하기</button>
          )}
        </div>
      </div>
    </>
  );

  // Auth screen
  return (
    <>
      <style>{STYLE}</style>
      <div className="page">
        <div className="card">
          <div className="logo">
            <div className="logo-badge">삼보어학원 · H-Inter</div>
            <h1>수요 클리닉 신청</h1>
            <p>정규반 H-Inter 클리닉 수업 신청</p>
          </div>

          {error && <div className="error">⚠️ {error}</div>}
          {successMsg && <div className="success">{successMsg}</div>}

          <div className="field">
            <label>학부모 전화번호</label>
            <input type="tel" placeholder="01012345678" value={loginPhone}
              onChange={e => { setLoginPhone(e.target.value.replace(/[^0-9a-zA-Z]/g,"")); }}
              onKeyDown={e => e.key==="Enter" && handleLogin()} />
          </div>
          {loginPhone.trim() === "ella" && (
            <div className="field">
              <label>관리자 비밀번호</label>
              <input type="password" placeholder="비밀번호 입력" value={loginPw}
                onChange={e => setLoginPw(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleLogin()} />
            </div>
          )}
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "확인 중..." : "입장하기"}
          </button>
          <p style={{fontSize:"12px",color:"#aaa",textAlign:"center",marginTop:"14px",lineHeight:"1.6"}}>
            번호가 등록되지 않은 경우<br/>선생님께 문의해주세요.
          </p>
        </div>
      </div>
    </>
  );
}
