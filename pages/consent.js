import React, { useState } from 'react';

function Consent({ setGivenConsent, checkConsent }) {
    const [wrongInitials, setWrongInitials] = useState(false);
    const [wrongDate, setWrongDate] = useState(false);

    const handleConsent = (e) => {
        e.preventDefault();
        const initials = document.getElementById('initials').value;
        const date = document.getElementById('date').value;

        if(initials.length <= 0) {
            setWrongInitials(true);
            return;
        } else {
            setWrongInitials(false);
        }
        const currentDate = new Date().toLocaleDateString().split('/');
        const selectedDate = date.split('-');
        if(parseInt(selectedDate[0]) !== parseInt(currentDate[2]) || parseInt(selectedDate[1]) !== parseInt(currentDate[0]) || parseInt(selectedDate[2]) !== parseInt(currentDate[1])) {
            setWrongDate(true);
            return;
        } else {
            setWrongDate(false);
        }

        const formData = new FormData();
        formData.append('uid', localStorage.getItem("uid"));
        formData.append('initials', initials);
        formData.append('date', date);

        setGivenConsent(true);
        fetch('/api/register', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Success:', data.message);
                checkConsent();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <>
            <h1>Research Study Participation</h1>
            <p><strong>SUMMARY OF KEY INFORMATION:</strong></p>
            <p>The purpose of the study is to understand the effect of different virtual try-on settings on online clothing shopping decision-making. The study will be conducted in one session where the participants will be asked to perform the same task under two different website design conditions. The entire study will take about 30 minutes. For the study, you will be asked to use an online clothing shopping website with the virtual try-on functionality that we created. You will be asked to upload one full-body image of yourself and/or choose one image among a set of predefined full-body model images. You may also be asked to indicate your true size for tops, bottoms, and dresses if applicable. Then, you will be asked to select some garments from the website and see how they look on the person in the previously uploaded/chosen image. In summary, the entire study involves filling out a pre-study questionnaire, trying version 1 of our try-on website, filling a post-task questionnaire, trying version 2 of our try-on website, filling a post-task questionnaire, filling a post-study questionnaire. Total time for the study is 30 minutes. Since you may be asked to upload images of yourself and/or indicate your true size, you may feel self-conscious. No personally identifiable information (name/email) will be stored with the data itself. We will assign an ID to you and keep your name/email separate from the data. We will also mask any face in collected images to protect your identity.</p>
            <p><strong>PURPOSE:</strong> You are being asked to participate in a research study. The purpose of the study is to understand the effect of different virtual try-on settings on online clothing shopping decision-making.</p>
            <p><strong>PROCEDURES:</strong> If you decide to participate, we will ask you to use an online shopping website we created. We will show you exactly the steps to use this website.
                Before the data collection, we will ask you to answer a pre-test questionnaire to understand your prior experience with online clothing websites and virtual try-on services. This will help us set the prior to help understand your experience of using our online clothing shopping websites with virtual try-on functionality
                To collect data, you will be asked to complete two sets of tasks. For each, you may be asked to upload one full-body image of yourself and/or choose one image among a set of predefined full-body model images. If you are doing this study in person, we will take the aforementioned full-body image of yourself for you with a camera we set on the study site. You may also be asked to indicate your true size upon uploading/choosing images. Then, you will be asked to use the website and its virtual try-on functionality, all uploaded/chosen images and images generated by the virtual try-on functionality will be stored for us to understand your experience using our website.
                After each set of tasks, you will be asked to answer a questionnaire for us to understand your experience using the website.
                The entire process will take less than 30 minutes.
            </p>
            <p><strong>RISKS:</strong> You may be uncomfortable having your photos taken, uploading images of yourself online, using online clothing websites, and/or using virtual try-on services. You may also feel uncomfortable indicating their true sizes if applicable. No personally identifiable information (name/email) will be stored with the data itself. We will assign an ID to the data instead. We will also mask any face in collected images to protect your identity.</p>
            <p><strong>BENEFITS:</strong> Your participation in the study will help advance knowledge about virtual try-on setting on online clothing shopping decision making.</p>
            <p><strong>CONFIDENTIALITY:</strong> No personally identifiable information (name/email) will be stored with the data itself. We will assign an ID to the data instead. We will also mask any face in collected images to protect your identity. The ID number will not be linked to personally identifiable information. Absolute confidentiality cannot be guaranteed, since research documents are not protected from subpoena. We may use or share your research information for future research studies. If we share your information with other researchers it will be de-identified, which means that it will not contain your name or other information that can directly identify you. This research may be similar to this study or completely different. We will not ask for your additional informed consent for future use of your de-identified data. The collected images may be used and shared in future research studies, conferences, and presentations, where we will again mask all images in the images.</p>
            <p><strong>QUESTIONS:</strong> If you have any questions about this research project or if you have any questions or concerns about your rights and treatment as a research subject, please contact: Sherry Chen, xchen774@ucsb.edu and/or Misha Sra, sra@ucsb.edu,5127731665. If you have any questions regarding your rights and participation as a research subject, please contact the Human Subjects Committee at (805) 893-3807 or hsc@research.ucsb.edu. Or write to the University of California, Human Subjects Committee, Office of Research, Santa Barbara, CA 93106-2050</p>
            <div style={{ margin: '20px' }}>
                <form>
                    <label style={{ marginBottom: '10px' }} htmlFor="initials">Enter your first and last name:</label>
                    <input style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }} type="text" id="initials" name="initials" placeholder="First and last name" />
                    {wrongInitials && <p style={{ color: 'red' }}>Please enter your first and last name</p>}
                    <label style={{ marginBottom: '10px' }} htmlFor="date">Date:</label>
                    <input style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }} type="date" id="date" name="date" />
                    {wrongDate && <p style={{ color: 'red' }}>Please enter today's date</p>}
                    <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} type="submit" onClick={handleConsent} >Submit</button>
                </form>
            </div>
        </>
    );
}

export default Consent;