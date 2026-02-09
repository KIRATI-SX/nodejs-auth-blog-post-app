import { MongoClient } from "mongodb";

async function testConnection() {
  const connectionString = "mongodb://localhost:27017";
  const client = new MongoClient(connectionString, {
    useUnifiedTopology: true,
  });

  try {
    console.log("🔄 กำลังเชื่อมต่อกับ MongoDB...");
    await client.connect();
    console.log("✅ เชื่อมต่อสำเร็จ!");

    const db = client.db("practice-mongo");
    
    // ทดสอบการเชื่อมต่อกับตาราง user
    console.log("\n🔄 กำลังทดสอบเชื่อมต่อกับ collection 'users'...");
    const usersCollection = db.collection("users");
    
    // นับจำนวน users ทั้งหมด
    const userCount = await usersCollection.countDocuments();
    console.log(`✅ จำนวน users ในฐานข้อมูล: ${userCount} ราย`);

    // ดึงตัวอย่าง users (ถ้ามี)
    const sampleUsers = await usersCollection.find({}).limit(5).toArray();
    if (sampleUsers.length > 0) {
      console.log("\n📋 ตัวอย่าง users ที่พบ:");
      sampleUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ID: ${user._id}, Email: ${user.email || 'N/A'}`);
      });
    } else {
      console.log("\n⚠️  ยังไม่มี users ในฐานข้อมูล");
    }

    console.log("\n✨ การทดสอบเสร็จสิ้น เชื่อมต่อได้ปกติ!");

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error.message);
  } finally {
    await client.close();
    console.log("\n🔌 ปิดการเชื่อมต่อกับ MongoDB");
  }
}

testConnection();
