import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";

async function seed() {
  console.log("🌱 Starting Hospital Database Seed (Localized & Comprehensive)...");

  const payload = await getPayload({ config });

  try {
    // 1. Clear Collections
    const collectionsToClear = [
      "notices",
      "staff",
      "services",
      "news",
      "hero-slides",
      "quick-links",
      "photo-gallery",
      "video-gallery",
      "pages",
    ] as const;

    for (const collection of collectionsToClear) {
      const { docs } = await payload.find({ collection: collection as any, limit: 1000 });
      for (const doc of docs) {
        await payload.delete({ collection: collection as any, id: doc.id });
      }
      console.log(`✅ Cleared ${collection}`);
    }

    // 2. Seed Pages
    const pagesData = [
      {
        title: "हाम्रो बारेमा (About Us)",
        slug: "about",
        content: {
          root: {
            type: "root",
            children: [
              { type: "heading", tag: "h2", children: [{ type: "text", text: "परिचय (Introduction)" }] },
              { type: "paragraph", children: [{ type: "text", text: "अम्पिपाल अस्पताल पालुङटार नगरपालिकाको एक प्रमुख र सुविधानिक स्वास्थ्य संस्था हो। यो अस्पताल पालुङटार नगरपालिकामा अवस्थित छ। विस्तृत समयदेखि यस क्षेत्रका नागरिकहरूलाई गुणस्तरीय स्वास्थ्य सेवा प्रदान गर्दै आएको यस अस्पतालले हाल आधुनिक प्रविधि र दक्ष जनशक्तिको माध्यमबाट सेवा विस्तार गरिरहेको छ।" }] },
              { type: "heading", tag: "h2", children: [{ type: "text", text: "हाम्रो इतिहास (Our History)" }] },
              { type: "paragraph", children: [{ type: "text", text: "यस अस्पतालको स्थापना वि.सं. २०१७ सालमा १५ शैयाको जिल्ला अस्पतालको रुपमा भएको थियो। समयको अन्तरालसँगै यस क्षेत्रको जनसंख्या र स्वास्थ्य आवश्यकतालाई मध्यनजर गर्दै वि.सं. २०७५ साल फागुन महिनादेखि यसलाई प्रादेशिक अस्पतालको रुपमा स्तरोन्नति गरिएको हो। हाल यो २०० शैयाको आधुनिक अस्पतालको रुपमा विकास भइरहेको छ।" }] },
              { type: "heading", tag: "h2", children: [{ type: "text", text: "लक्षय र उद्देश्य (Vision & Mission)" }] },
              { type: "paragraph", children: [{ type: "text", text: "हाम्रो लक्ष्य भनेको गण्डकी प्रदेशकै एक नमूना र भरपर्दो स्वास्थ्य सेवा केन्द्रको रुपमा स्थापित हुनु हो। हामी बिरामीको सेवालाई सर्बोपरी ठान्दै सुरक्षित, सुलभ र गुणस्तरीय स्वास्थ्य सेवा प्रदान गर्न प्रतिबद्ध छौं।" }] },
            ]
          }
        },
        status: "published"
      },
      {
        title: "अस्पताल व्यवस्थापन समिति (Management Committee)",
        slug: "committee",
        content: {
          root: {
            type: "root",
            children: [
              { type: "heading", tag: "h2", children: [{ type: "text", text: "व्यवस्थापन समितिको संरचना" }] },
              { type: "paragraph", children: [{ type: "text", text: "अस्पतालको समग्र नीति निर्माण, योजना तर्जुमा र व्यवस्थापकीय कार्यहरूको रेखदेखका लागि बागलुङ अस्पताल विकास समिति सक्रिय रूपमा कार्यिरहेको छ। यस समितिमा स्थानीय सरोकारवाला, चिकित्सक र विज्ञहरूको प्रतिनिधित्व रहेको छ।" }] },
              { type: "heading", tag: "h3", children: [{ type: "text", text: "समितिका मुख्य जिम्मेवारीहरू:" }] },
              {
                type: "list", listType: "bullet", children: [
                  { type: "listitem", children: [{ type: "text", text: "अस्पतालको दीर्घकालीन योजना र बजेट स्वीकृत गर्ने।" }] },
                  { type: "listitem", children: [{ type: "text", text: "सेवा प्रवाहको गुणस्तर र प्रभावकारिताको अनुगमन गर्ने।" }] },
                  { type: "listitem", children: [{ type: "text", text: "कर्मचारी व्यवस्थापन र भौतिक पूर्वाधार विकासका लागि नीति बनाउने।" }] },
                  { type: "listitem", children: [{ type: "text", text: "सरकार र जनस्तरसँग समन्वय गरी अस्पतालको विकासमा सहजीकरण गर्ने।" }] },
                ]
              },
            ]
          }
        },
        status: "published"
      },
      {
        title: "सम्पर्क",
        slug: "contact",
        content: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "हामीलाई सम्पर्क गर्नको लागि ०६८-५२०२८८ मा फोन गर्नुहोस् वा ईमेल पठाउनुहोस्।" }] }] } },
        status: "published"
      },
      {
        title: "नागरिक वडापत्र (Citizen Charter)",
        slug: "citizen-charter",
        content: {
          root: {
            type: "root",
            children: [
              { type: "heading", tag: "h2", children: [{ type: "text", text: "नागरिक वडापत्र" }] },
              { type: "paragraph", children: [{ type: "text", text: "यस अस्पतालबाट प्रदान गरिने मुख्य सेवाहरू, लाग्ने दस्तुर र सेवा प्राप्त गर्ने प्रक्रियाको विवरण निम्न बमोजिम छ:" }] },

              { type: "heading", tag: "h3", children: [{ type: "text", text: "१. बहिरङ्ग (OPD) सेवा" }] },
              {
                type: "list", listType: "bullet", children: [
                  { type: "listitem", children: [{ type: "text", text: "आवश्यक कागजात: परिचय पत्र वा अघिल्लो जाँचको पुर्जी" }] },
                  { type: "listitem", children: [{ type: "text", text: "दस्तुर: रु. ५० (टिकट शुल्क)" }] },
                  { type: "listitem", children: [{ type: "text", text: "समय: ३० मिनेट देखि १ घण्टा (बिरामीको चाप अनुसार)" }] },
                  { type: "listitem", children: [{ type: "text", text: "जिम्मेवार अधिकारी: ओपिडि इन्चार्ज" }] },
                ]
              },

              { type: "heading", tag: "h3", children: [{ type: "text", text: "२. आकस्मिक (Emergency) सेवा" }] },
              {
                type: "list", listType: "bullet", children: [
                  { type: "listitem", children: [{ type: "text", text: "आवश्यक कागजात: तुरुन्तै उपलब्ध हुने कुनै पनि विवरण" }] },
                  { type: "listitem", children: [{ type: "text", text: "दस्तुर: रु. १०० (टिकट)" }] },
                  { type: "listitem", children: [{ type: "text", text: "समय: तत्काल" }] },
                  { type: "listitem", children: [{ type: "text", text: "जिम्मेवार अधिकारी: आकस्मिक विभाग प्रमुख" }] },
                ]
              },

              { type: "heading", tag: "h3", children: [{ type: "text", text: "३. प्रसुती सेवा" }] },
              {
                type: "list", listType: "bullet", children: [
                  { type: "listitem", children: [{ type: "text", text: "आवश्यक कागजात: जाँच गराएको कार्ड वा लालपुर्जा" }] },
                  { type: "listitem", children: [{ type: "text", text: "दस्तुर: सरकारी नियम अनुसार निशुल्क (आमा सुरक्षा कार्यक्रम)" }] },
                  { type: "listitem", children: [{ type: "text", text: "समय: आवश्यकता अनुसार" }] },
                ]
              },

              { type: "heading", tag: "h3", children: [{ type: "text", text: "४. ल्याब तथा एक्सरे सेवा" }] },
              {
                type: "list", listType: "bullet", children: [
                  { type: "listitem", children: [{ type: "text", text: "आवश्यक कागजात: चिकित्सकको सिफारिस पुर्जी" }] },
                  { type: "listitem", children: [{ type: "text", text: "दस्तुर: स्वीकृत दररेट अनुसार" }] },
                  { type: "listitem", children: [{ type: "text", text: "समय: रिपोर्टको प्रकृति अनुसार (१ घण्टा देखि २४ घण्टा)" }] },
                ]
              },

              { type: "paragraph", children: [{ type: "text", text: "थप जानकारीको लागि अस्पतालको सूचना अधिकृत वा सहायता कक्षमा सम्पर्क गर्नुहोला।" }] },
            ]
          }
        },
        status: "published"
      },
    ];
    for (const p of pagesData) {
      await payload.create({ collection: "pages", data: p as any });
    }
    console.log("✅ Seeded Pages");

    // 3. Seed Site Settings (Global)
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        hospitalNameNe: "अम्पिपाल अस्पताल",
        hospitalNameEn: "Amppipal Hospital",
        taglineNe: "स्वास्थ्य सेवा, सबैका लागि",
        taglineEn: "Healthcare for All",
        siteUrl: "https://amppipalhospital.gov.np",
        address: "पालुङटार नगरपालिका – ३, गोरखा, नेपाल",
        addressEn: "Palungtar Municipality - 3, Gorkha, Nepal",
        contactEmail: "Amppipalhospital25@gmail.com",
        contactPhone: "00977-9846-208709",
        emergencyNumber: "00977-9846-208709",
        aboutUs: "अम्पिपाल अस्पताल पालुङटार नगरपालिकाको एक प्रमुख स्वास्थ्य संस्था हो। यो अस्पताल गोरखा जिल्लाका नागरिकहरूलाई गुणस्तरीय स्वास्थ्य सेवा प्रदान गर्दै आइरहेको छ। हाम्रो लक्ष्य सुरक्षित, भरपर्दो र आधुनिक स्वास्थ्य सेवा सुनिश्चित गर्नु हो।",
        facebook: "https://facebook.com/AmppipalHospital",
        twitter: "https://twitter.com/AmppipalHospital",
        youtube: "https://youtube.com/AmppipalHospital",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.65751963249!2d83.5857853!3d28.2175965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995f54366666667%3A0xc3b092770222a7f!2zRGhhdWxhZ2lyaSBa b25hbCBIb3NwaXRhbA!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp",
      },
    });
    console.log("✅ Seeded Site Settings");

    // 4. Seed Staff
    const staffData = [
      {
        name: "श्रीप्रसाद शर्मा",
        nameEn: "Shree Prasad Sharma",
        designation: "सभापति",
        role: "chair",
        isActive: true,
        showOnHomepage: true,
        order: 1,
        externalPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        name: "डा. किरण तिवारी",
        nameEn: "Dr. Kiran Tiwari",
        designation: "मुख्य मेडिकल अधीक्षक",
        role: "cms",
        isActive: true,
        showOnHomepage: true,
        order: 2,
        externalPhoto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        name: "शान्ति पौडेल",
        nameEn: "Shanti Paudel",
        designation: "सूचना अधिकारी",
        role: "info-officer",
        phone: "९८५७६८७००९",
        email: "dhaulagiri.suchana@gmail.com",
        isActive: true,
        showOnHomepage: true,
        order: 3,
        externalPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        name: "राम बहादुर केसी",
        nameEn: "Ram Bahadur KC",
        designation: "सदस्य, अस्पताल विकास समिति",
        role: "management-committee",
        isActive: true,
        order: 4,
        externalPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        name: "माया देवी सापकोटा",
        nameEn: "Maya Devi Sapkota",
        designation: "सदस्य, अस्पताल विकास समिति",
        role: "management-committee",
        isActive: true,
        order: 5,
        externalPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        name: "डा. राम बहादुर केसी",
        nameEn: "Dr. Ram Bahadur KC",
        designation: "वरिष्ठ परामर्शदाता",
        role: "doctor",
        department: "Surgery",
        isActive: true,
        showOnHomepage: false,
        order: 6,
        externalPhoto: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        name: "डा. सुनिता थापा",
        nameEn: "Dr. Sunita Thapa",
        designation: "कन्सल्टेन्ट",
        role: "doctor",
        department: "Gynecology",
        isActive: true,
        showOnHomepage: false,
        order: 7,
        externalPhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        name: "नर्मदा गुरुङ",
        nameEn: "Narmada Gurung",
        designation: "प्रमुख नर्स",
        role: "nurse",
        department: "Nursing",
        isActive: true,
        showOnHomepage: false,
        order: 8,
        externalPhoto: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
      },
    ];

    for (const s of staffData) {
      await payload.create({ collection: "staff", data: s as any });
    }
    console.log(`✅ Seeded ${staffData.length} Staff`);


    // 5. Seed Services (Comprehensive List with content)
    const servicesData = [
      {
        name: "बहिरङ्ग सेवा (OPD)",
        slug: "opd-service",
        icon: "🏥",
        category: "opd",
        shortDescription: "विशेषज्ञ चिकित्सकहरूबाट दैनिक स्वास्थ्य परीक्षण र परामर्श सेवा।",
        time: "१०:०० AM - ४:०० PM",
        fee: "रु. ५०",
        order: 1,
        content: {
          root: {
            type: "root",
            children: [
              { type: "heading", tag: "h2", children: [{ type: "text", text: "हाम्रा ओपिडि सेवाहरू" }] },
              { type: "paragraph", children: [{ type: "text", text: "अम्पिपाल अस्पतालले विभिन्न विभागहरू मार्फत विशेषज्ञ बहिरङ्ग सेवा प्रदान गर्दै आएको छ। बिरामीहरूले बिहान ७ बजेदेखि स्वास्थ्य परीक्षणको लागि टिकट लिन सक्नेछन्।" }] },
              {
                type: "list", listType: "bullet", children: [
                  { type: "listitem", children: [{ type: "text", text: "जनरल मेडिसिन र सर्जरी" }] },
                  { type: "listitem", children: [{ type: "text", text: "स्त्री तथा प्रसुती रोग र बाल रोग " }] },
                  { type: "listitem", children: [{ type: "text", text: "हाडजोर्नी तथा मुटु रोग" }] },
                ]
              },
            ]
          }
        }
      },
      {
        name: "आकस्मिक सेवा (Emergency)",
        slug: "emergency-service",
        icon: "🚨",
        category: "emergency",
        time: "२४ घण्टा",
        shortDescription: "चौबिसै घण्टा दक्ष चिकित्सक तथा नर्सहरूबाट आकस्मिक स्वास्थ्य उपचार।",
        order: 2,
        content: {
          root: {
            type: "root",
            children: [
              { type: "heading", tag: "h2", children: [{ type: "text", text: "२४सै घण्टा आकस्मिक सेवा" }] },
              { type: "paragraph", children: [{ type: "text", text: "अस्पतालको आकस्मिक विभाग कुनै पनि समयमा आइपर्ने गम्भीर स्वास्थ्य समस्याहरूलाई सम्बोधन गर्न पूर्ण रूपमा तयार छ।" }] },
            ]
          }
        }
      },
      {
        name: "शल्यक्रिया सेवा (Surgery)",
        slug: "surgery-service",
        icon: "🔪",
        category: "specialized",
        shortDescription: "आधुनिक शल्यक्रिया कक्षबाट दक्ष्य चिकित्सकहरूद्वारा गरिने शल्यक्रिया।",
        order: 3,
        content: {
          root: {
            type: "root",
            children: [
              { type: "heading", tag: "h2", children: [{ type: "text", text: "विशेषज्ञ शल्यक्रिया सेवा" }] },
              { type: "paragraph", children: [{ type: "text", text: "हामीले विभिन्न विधामा टेलि-सर्जरी र ल्याप्रोस्कोपिक विधिबाट पनि शल्यक्रिया सेवा प्रदान गर्दै आएका छौं।" }] },
            ]
          }
        }
      },
      {
        name: "निदान सेवा (Laboratory & Imaging)",
        slug: "diagnostic-service",
        icon: "🔬",
        category: "diagnostic",
        shortDescription: "डिजिटल एक्सरे, रगत परीक्षण र आधुनिक भिडियो एक्सरे सेवा।",
        order: 4,
        content: {
          root: {
            type: "root",
            children: [
              { type: "heading", tag: "h2", children: [{ type: "text", text: "सटिक निदान सेवा" }] },
              { type: "paragraph", children: [{ type: "text", text: "हाम्रो अस्पतालमा अत्याधुनिक मेसिनहरूबाट गरिने परीक्षणले उपचारलाई थप प्रभावकारी बनाउँछ।" }] },
            ]
          }
        }
      },
      { name: "प्रसूतिका सेवा", icon: "🍼", category: "maternal-child", order: 5 },
      { name: "फार्मेसी", icon: "💊", category: "specialized", order: 6 },
      { name: "आईसीयू (ICU)", icon: "🛏️", category: "specialized", order: 7 },
      { name: "सीटी स्क्यान", icon: "🩺", category: "diagnostic", order: 8 },
    ];

    for (const s of servicesData) {
      await payload.create({
        collection: "services",
        data: {
          ...s,
          isActive: true
        } as any
      });
    }
    console.log(`✅ Seeded ${servicesData.length} Services`);

    // 6. Seed News & Notices
    const newsItems = [
      {
        title: "अस्पतालमा नयाँ विशेषज्ञ चिकित्सकहरूको आगमन",
        slug: "new-doctors-arrival",
        type: "news",
        status: "published",
        isFeatured: true,
        publishedDate: new Date().toISOString(),
        externalFeaturedImage: "https://images.unsplash.com/photo-1505751172107-57322a3e53dd?auto=format&fit=crop&q=80&w=800",
        excerpt: "बागलुङ अस्पतालमा सेवा प्रभावकारिता बढाउन थप ३ जना कन्सल्टेन्ट चिकित्सकहरू थपिएका छन्।",
      },
      {
        title: "पोषण सम्बन्धि सचेतना कार्यक्रम सम्पन्न",
        slug: "nutrition-awareness",
        type: "news",
        status: "published",
        publishedDate: new Date(Date.now() - 86400000).toISOString(),
        externalFeaturedImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800",
        excerpt: "जिल्लाका ५ वटा पालिकामा पोषण सचेतना अभियान सफलतापूर्वक सम्पन्न भयो।",
      },
      {
        title: "स्वास्थ्य बीमा सेवा सुरु भएको जानकारी",
        slug: "health-insurance-service",
        type: "news",
        status: "published",
        publishedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        externalFeaturedImage: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=800",
        excerpt: "यस अस्पतालमा अब स्वास्थ्य बीमा कार्यक्रम अन्तर्गत निःशुल्क उपचार उपलब्ध भएको जानकारी गराइन्छ।",
      },
      {
        title: "प्रेस विज्ञप्ति: डेंगु संक्रमण बढ्दै",
        slug: "press-dengue",
        type: "press-release",
        status: "published",
        publishedDate: new Date().toISOString(),
        externalFeaturedImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800",
        excerpt: "जिल्लामा डेंगु संक्रमण बढ्दै गएकाले सबैलाई सतर्क रहन आग्रह गरिन्छ।",
      },
      {
        title: "स्वास्थ्य सेवा सुधार सम्बन्धि वार्षिक प्रतिवेदन",
        slug: "annual-health-report-2081",
        type: "publication",
        status: "published",
        publishedDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        externalFeaturedImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
        excerpt: "आर्थिक वर्ष २०८०/०८१ को स्वास्थ्य सेवाको वार्षिक प्रतिवेदन प्रकाशित भएको छ।",
        externalFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "ठेक्का आह्वान सम्बन्धि सूचना",
        slug: "tender-notice-2081",
        type: "bid",
        status: "published",
        publishedDate: new Date().toISOString(),
        excerpt: "अस्पताल भवन मर्मत एवं सुधार कार्यका लागि इच्छुक ठेकेदारहरूबाट बोलपत्र आह्वान गरिन्छ।",
        externalFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ];

    for (const news of newsItems) {
      await payload.create({ collection: "news", data: news as any });
    }
    console.log(`✅ Seeded ${newsItems.length} News articles`);


    // List of notices for popup — matches screenshot design
    const popupNotices = [
      {
        // Notice 1: Scanned government letter style — portrait document image
        title: "बोर्ड बैठकको निर्णय कार्यान्वयन सम्बन्धमा",
        status: "published",
        publishedDate: new Date().toISOString(),
        showInPopup: true,
        popupStartDate: new Date().toISOString(),
        popupEndDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        externalImage: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=820&h=1160",
        externalFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        // Notice 2: Health insurance notice with portrait image
        title: "स्वास्थ्य बीमा सम्बन्धी महत्त्वपूर्ण सूचना",
        status: "published",
        publishedDate: new Date().toISOString(),
        showInPopup: true,
        popupStartDate: new Date().toISOString(),
        popupEndDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        externalImage: "https://images.unsplash.com/photo-1586773860418-d3196ed0df51?auto=format&fit=crop&q=80&w=820&h=1160",
        externalFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        // Notice 3: Text-only notice (dengue alert)
        title: "डेंगु संक्रमणबाट बच्ने उपायहरु — जरुरी सूचना",
        description: "अस्पतालमा डेंगुका बिरामीहरु बढेकाले सबैलाई सतर्क रहन अनुरोध गरिन्छ।\n\n• लामखुट्टेको टोकाइबाट बच्न झुलको प्रयोग गर्नुहोस्\n• घर वरिपरि पानी जम्न नदिनुहोस्\n• ज्वरो आएमा तुरुन्त डाक्टरलाई देखाउनुहोस्\n\nआकस्मिक सम्पर्क: ०६८-५२४१०४",
        status: "published",
        publishedDate: new Date().toISOString(),
        showInPopup: true,
        popupStartDate: new Date().toISOString(),
        popupEndDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      },
    ];

    for (const notice of popupNotices) {
      await payload.create({ collection: "notices", data: notice as any });
    }
    console.log(`✅ Seeded ${popupNotices.length} Popup Notices`);
    console.log("✅ Seeded News and Notices");

    // 6.5 Seed Hero Slides
    const slides = [
      {
        title: "अस्पतालको अनुगमन",
        caption: "स्वास्थ्य मन्त्री माननीय कृष्ण प्रसाद पाठकज्यूबाट अस्पतालको अनुगमन",
        order: 1,
        externalImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1400",
        isActive: true
      },
      {
        title: "नयाँ भवन उद्घाटन्",
        caption: "अस्पतालको नयाँ अक्सिजन प्लान्ट संचालनमा",
        order: 2,
        externalImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1400",
        isActive: true
      },
      {
        title: "बिरामी सेवा",
        caption: "हामी सधैं गुणस्तरीय सेवा प्रदान गर्न प्रतिबद्ध छौं",
        order: 3,
        externalImage: "https://images.unsplash.com/photo-1586773860418-d3196ed0df51?auto=format&fit=crop&q=80&w=1400",
        isActive: true
      }
    ];

    for (const slide of slides) {
      await payload.create({ collection: "hero-slides", data: slide as any });
    }
    console.log("✅ Seeded Hero Slides");

    // 7. Seed Quick Links
    const quickLinks = [
      { label: "हाम्रो बारेमा", icon: "ℹ️", url: "/about", order: 1 },
      { label: "स्वतः प्रकाशन", icon: "📜", url: "/citizen-charter", order: 2 },
      { label: "हाम्रा सेवाहरु", icon: "🛠️", url: "/services", order: 3 },
      { label: "सूचना/समाचार", icon: "📰", url: "/news", order: 4 },
      { label: "हाम्रो टिम", icon: "👥", url: "/staff", order: 5 },
      { label: "डाउनलोड", icon: "📥", url: "/downloads", order: 6 },
      { label: "सम्पर्क", icon: "📞", url: "/contact", order: 7 },
    ];
    for (const link of quickLinks) {
      await payload.create({ collection: "quick-links", data: { ...link, isActive: true } as any });
    }
    console.log("✅ Seeded Quick Links");

    // 8. Seed OPD Stats
    await payload.updateGlobal({
      slug: "opd-stats",
      data: {
        opdTotal: 450,
        opdMale: 210,
        opdFemale: 240,
        inpatientTotal: 45,
        inpatientMale: 20,
        inpatientFemale: 25,
        totalBeds: 150,
        bedOccupancy: 85,
        lastUpdatedDate: new Date().toISOString(),
      },
    });
    console.log("✅ Seeded OPD Stats");

    // 9. Seed Navigation
    await payload.updateGlobal({
      slug: "navigation",
      data: {
        mainNav: [
          { label: "गृहपृष्ठ", type: "custom", customUrl: "/" },
          {
            label: "हाम्रो बारेमा",
            type: "custom",
            customUrl: "/about",
            subMenu: [
              { label: "हाम्रो बारेमा", type: "custom", customUrl: "/about" },
              { label: "व्यवस्थापन समिति", type: "custom", customUrl: "/committee" },
              { label: "नागरिक वडापत्र", type: "custom", customUrl: "/citizen-charter" },
              { label: "हाम्रो टिम", type: "custom", customUrl: "/staff" },
            ],
          },
          { label: "सूचना तथा समाचार", type: "custom", customUrl: "/news" },
          { label: "हाम्रा सेवाहरु", type: "custom", customUrl: "/services" },
          { label: "डाउनलोड", type: "custom", customUrl: "/downloads" },
          { label: "सम्पर्क", type: "custom", customUrl: "/contact" },
        ],
      },
    });
    console.log("✅ Seeded Navigation");

    // 10. Seed Photo Gallery
    const photoAlbums = [
      {
        title: "अस्पतालको नयाँ भवन",
        description: "अस्पतालको नवनिर्मित भवन र त्यहाँ उपलब्ध सुविधाहरू।",
        externalCoverImage: "https://images.unsplash.com/photo-1586773860418-d3196ed0df51?auto=format&fit=crop&q=80&w=800",
        isActive: true,
        images: [
          { externalImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200", caption: "मुख्य प्रवेशद्वार" },
          { externalImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200", caption: "ओपिडि कक्ष" },
          { externalImage: "https://images.unsplash.com/photo-1586773860418-d3196ed0df51?auto=format&fit=crop&q=80&w=1200", caption: "अपरेशन थिएटर" },
          { externalImage: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&q=80&w=1200", caption: "आईसियु कक्ष" },
        ],
      },
      {
        title: "स्वास्थ्य शिविर २०८१",
        description: "दुर्गम क्षेत्रमा संचालन गरिएको स्वास्थ्य शिविरका झलकहरू।",
        externalCoverImage: "https://images.unsplash.com/photo-1505751172107-57322a3e53dd?auto=format&fit=crop&q=80&w=800",
        isActive: true,
        images: [
          { externalImage: "https://images.unsplash.com/photo-1505751172107-57322a3e53dd?auto=format&fit=crop&q=80&w=1200", caption: "बिरामी परीक्षण" },
          { externalImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200", caption: "औषधि वितरण" },
          { externalImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1200", caption: "स्वास्थ्य सचेतना" },
        ],
      },
      {
        title: "अस्पताल टिम",
        description: "धौलागिरी प्रादेशिक अस्पतालका समर्पित चिकित्सक र कर्मचारीहरू।",
        externalCoverImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800",
        isActive: true,
        images: [
          { externalImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=1200", caption: "वरिष्ठ चिकित्सक टिम" },
          { externalImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1200", caption: "नर्सिङ टिम" },
          { externalImage: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=1200", caption: "प्रशासनिक कर्मचारी" },
        ],
      },
      {
        title: "विशेष कार्यक्रम",
        description: "अस्पतालमा आयोजित विशेष स्वास्थ्य र सामुदायिक कार्यक्रमहरू।",
        externalCoverImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800",
        isActive: true,
        images: [
          { externalImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200", caption: "विश्व स्वास्थ्य दिवस" },
          { externalImage: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=1200", caption: "रक्तदान कार्यक्रम" },
        ],
      },
    ];

    for (const album of photoAlbums) {
      await payload.create({ collection: "photo-gallery", data: album as any });
    }
    console.log(`✅ Seeded ${photoAlbums.length} Photo Gallery Albums`);


    // 11. Seed Video Gallery
    const videos = [
      {
        title: "अस्पतालको डकुमेन्ट्री",
        description: "धौलागिरी प्रादेशिक अस्पतालको सेवा र इतिहास सम्बन्धि छोटो वृत्तचित्र।",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        publishedDate: new Date().toISOString(),
        isActive: true
      },
      {
        title: "स्वास्थ्य सुझाव",
        description: "स्वस्थ रहनका लागि केही महत्त्वपूर्ण सुझावहरू।",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        publishedDate: new Date().toISOString(),
        isActive: true
      }
    ];

    for (const video of videos) {
      await payload.create({ collection: "video-gallery", data: video as any });
    }
    console.log("✅ Seeded Video Gallery");

    // 12. Seed Footer
    await payload.updateGlobal({
      slug: "footer",
      data: {
        copyright: `© ${new Date().getFullYear()} धौलागिरी प्रादेशिक अस्पताल. सर्वाधिकार सुरक्षित।`,
        footerText: "बागलुङ, नेपाल - स्वास्थ्य सेवा, सबैका लागि",
        columns: [
          {
            title: "महत्त्वपूर्ण लिङ्कहरू",
            links: [
              { label: "गृहपृष्ठ", type: "custom", customUrl: "/" },
              { label: "सेवाहरू", type: "custom", customUrl: "/services" },
              { label: "सम्पर्क", type: "custom", customUrl: "/contact" },
            ],
          },
        ],
      }
    });
    console.log("✅ Seeded Footer");

    console.log("\n🚀 COMPREHENSIVE HOSPITAL SEED COMPLETED SUCCESSFULLY!");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
