Character Lab ChatGPT App V1.1 — เจ้าของงาน: อาจาร์ยเอ

ผลลัพธ์ที่ออกแบบไว้:
- ฟอร์ม Character Lab แสดงภายใน ChatGPT ผ่าน MCP App UI
- แนบภาพอ้างอิงได้ 6 ประเภท
- ภาพที่เลือกจะอัปโหลดเข้า ChatGPT ด้วย window.openai.uploadFile เมื่อ Host รองรับ
- ปุ่ม “สร้างภาพใน GPT” ส่งสถานะฟอร์ม + imageIds ให้โมเดล แล้วส่ง Follow-up ให้ ChatGPT สร้างภาพทันที
- ไม่ใช้วิธีเปิด chatgpt.com หรือ Copy/Paste Prompt

ไฟล์:
- public/character-lab.html = ฟอร์ม Character Lab
- server.js = MCP Server / UI Resource / Tools
- package.json = Dependency

QC ที่ทำแล้ว:
1) node --check server.js ผ่าน
2) ตรวจว่า UI มี uploadFile, setWidgetState, callTool และ sendFollowUpMessage ครบ

ข้อจำกัดการทดสอบในสภาพแวดล้อมนี้:
- npm install ไม่เสร็จภายในเวลาที่ระบบอนุญาต จึงยังไม่ได้ทดสอบ MCP Server แบบ end-to-end
- การใช้งานจริงต้อง Deploy Server เป็น HTTPS และเชื่อม Plugin กับ ChatGPT ก่อน
