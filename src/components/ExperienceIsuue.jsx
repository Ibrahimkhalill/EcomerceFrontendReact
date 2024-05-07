import React, { useState, useEffect, useRef } from "react";
import "../css/style.css";
import "../css/bootstrap.css";
import "../css/responsive.css";

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import success from "../images/success.png"
const ExperienceIsuue = () => {
  const [experience, setExperienceBox] = useState(false);
  const [issue, setIsuue] = useState(false);
  const [listissue, setListIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [feedback,setFeedback] = useState("")
  const [feedBackdata, setFeedbackdata] = useState("")
  const [issue_details,setIssueData] =useState("")
  const [issue_detailsData,setIssueDeatilsData] =useState("")
  const searchexperincehandle = () => {
    setExperienceBox(true);
    setIsuue(false)
  };
  const cancelbox = () => {
    setExperienceBox(false);
    setIsuue(false)
  };
  const issuehandle = () => {
    setIsuue(true);
    setExperienceBox(false)
  };
  const handleListIssueToggle = () => {
    setListIssue((prev) => !prev);
  };

  const handleListIssueClick = (event) => {
    event.stopPropagation();
    handleListIssueToggle();
  };

  const divRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the div
      if (divRef.current && !divRef.current.contains(event.target)) {
        setListIssue(false);
      }
    };

    // Attach the event listener to the document
    document.addEventListener("click", handleOutsideClick);

    // Cleanup: Remove the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setListIssue(false);
  };
  const submitIssue = async()=>{
    try {
        const response = await fetch ("http://127.0.0.1:8000/api/save/ecomerce/issue/ ",{
            method:"POST",
            headers:{
                "Content-type": "application/json",
            },
            body: JSON.stringify({issue_name: selectedIssue,issue_details:issue_details})
        })

        const data = await response.json()
        setIssueDeatilsData(data)
        setFeedbackdata(data)
        console.log(data);
    } catch (error) {
        console.log(error);
    }
  } 
  const submitfeedback = async()=>{
    try {
        const response = await fetch ("http://127.0.0.1:8000/api/save/feedback/",{
            method:"POST",
            headers:{
                "Content-type": "application/json",
            },
            body: JSON.stringify({feedback: feedback})
        })

        const data = await response.json()
        setFeedbackdata(data)
        console.log(data);
    } catch (error) {
        console.log(error);
    }
  } 
  return (
    <>
       {feedBackdata ?<div style={{fontSize:"1.4vw", display:"flex",alignItems:"center" }} ><img src={success} width={25} alt="" /> {feedBackdata}</div>  :(
       <>
        <div className="feedback_product">
          <h5>Did you find what you were looking for?</h5>
          <button
            onClick={searchexperincehandle}
            className={experience ? "active" : ""}
          >
            Yes
          </button>
          <button onClick={issuehandle} className={issue ? "active" : ""}>
            NO
          </button>
        </div>
     
      

      {experience && (
        <div>
          <hr />
          <div style={{color:"#000000b3", fontSize:"1vw"}}>
            We'd love to hear from you about our search experience. Your
            feedback will help us improve MIK Lifestyle for everyone.
          </div>
          <div className="experice_text_area">
            <textarea name="" onChange={(e)=>setFeedback(e.target.value)} id="" cols="112" rows="3" />
            <div className="experice_text_area_button">
              <button onClick={submitfeedback} >Submit</button>
              <button className="cancel" onClick={cancelbox}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
      {issue_detailsData ?"":(
    <>
    {issue && (
        <div>
          <hr />
          <span style={{color:"#000000b3",fontSize:"1vw", display:"flex",alignItems:"center"}}> <span style={{color:"red", fontSize:"1.3vw", marginTop:".4vw", marginRight:".1vw"}} >*</span> Choose a option that best describe your problem.</span> 
          <div
            ref={divRef}
            className="experice_text_area_issue"
            onClick={handleListIssueToggle}
          >
           {selectedIssue ? selectedIssue :"Please Select An Issue"} 
            <span className="arrow_icon">
              {listissue ? (
                <IoIosArrowUp />
              ) : (
                <IoIosArrowDown onClick={handleListIssueClick} />
              )}
            </span>
          </div>{" "}
          {listissue && (
            <div
              className="list_box_issue"
              style={{ position: "absolute", zIndex: 1 }}
            >
              <div
                className={`list_issue ${
                  selectedIssue === "Above my budget" ? "selecte" : ""
                }`}
                onClick={() => handleIssueSelect("Above my budget")}
              >
                Above my budget
              </div>
              <div
                className={`list_issue ${
                  selectedIssue === "Filter Option is not helpful"
                    ? "selecte"
                    : ""
                }`}
                onClick={() =>
                  handleIssueSelect("Filter Option is not helpful")
                }
              >
                Filter Option is not helpful
              </div>
              <div
                className={`list_issue ${
                  selectedIssue === "Not enough variety or choice"
                    ? "selecte"
                    : ""
                }`}
                onClick={() =>
                  handleIssueSelect("Not enough variety or choice")
                }
              >
                Not enough variety or choice
              </div>
              <div
                className={`list_issue ${
                  selectedIssue === "Irrelevant result" ? "selecte" : ""
                }`}
                onClick={() => handleIssueSelect("Irrelevant result")}
              >
                Irrelevant result
              </div>
            </div>
          )}
          <div style={{color:"#000000b3", fontSize:"1vw", marginTop:".7vw"}}>
            Please share any more details around the issue. Your feedback will
            help us improve Daraz for everyone.
          </div>
          <div className="experice_text_area">
            <textarea onChange={(e)=>setIssueData(e.target.value)} cols="112" rows="3" />
            <div className="experice_text_area_button">
              <button onClick={submitIssue} >Submit</button>
              <button className="cancel" onClick={cancelbox}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </>
  );
};

export default ExperienceIsuue;
