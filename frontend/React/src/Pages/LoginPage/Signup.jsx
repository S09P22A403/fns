import React from "react";
import {
  Grid,
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Modal,
} from "@mui/material";
import "./CSS/Signup.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../../Redux/actions/actions";
import axios from "axios";

const Signup = () => {
  const SERVER_API_URL = `${process.env.REACT_APP_API_SERVER_URL}`;
  const dispatch = useDispatch();

  // const [유효한닉네임, set유효한닉네임] = useState(false);
  const [이메일, set이메일] = useState("");
  const [이메일전송, set이메일전송] = useState(false);
  const [이메일모달버튼, set이메일모달버튼] = useState(false);
  const [이메일인증번호, set이메일인증번호] = useState("");
  const [이메일인증, set이메일인증] = useState(false);
  const [이메일인증모달, set이메일인증모달] = useState(false);

  const 이메일전송버튼 = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `${SERVER_API_URL}/auth/send-email`,
        data: {
          email: 이메일,
        },
      });

      console.log("이메일 전송");
      console.log(res);

      // 만약 response로 뭔가 하려면 await 앞에 const res = 같은거로 변수 선언 시켜놓고 res.data같은거 쓰면 됨.

      set이메일전송(true);
      set이메일모달버튼(true);
      setTimeout(() => set이메일모달버튼(false), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const 이메일인증확인버튼 = async () => {
    // 이메일 인증번호 check하고 맞으면 disabled가 켜지게 해야함
    try {
      const res = await axios({
        method: "post",
        url: `${SERVER_API_URL}/auth/check-email`,
        data: {
          email: 이메일,
          code: 이메일인증번호,
        },
      });

      console.log("이메일 인증 확인");
      console.log(res);

      if (res.data.success) {
        set이메일인증(true);
        set이메일인증모달(true);
        setTimeout(() => set이메일인증모달(false), 2000);
      } else {
        set이메일인증(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [비밀번호, set비밀번호] = useState("");
  const [비밀번호확인, set비밀번호확인] = useState("");
  const [일치여부확인, set일치여부확인] = useState(false);
  const [비번양식확인, set비번양식확인] = useState(false);

  const navigate = useNavigate();

  const [가입실패, set가입실패] = useState("");
  const [가입실패창, set가입실패창] = useState(false);

  const 가입버튼 = async () => {
    // 이메일 전송 안 했음
    if (이메일전송) {
      // 이메일 인증 확인
      if (이메일인증) {
        // 비밀번호 양식 확인
        if (비번양식확인) {
          // 비밀번호 재입력과 일치여부 확인
          if (일치여부확인) {
            console.log(이메일);
            console.log(비밀번호);
            console.log(비밀번호확인);

            try {
              const res = await axios({
                method: "post",
                url: `${SERVER_API_URL}/members/sign-up`,
                data: {
                  email: 이메일,
                  password: 비밀번호,
                  password2: 비밀번호확인,
                  provider: "DEFAULT",
                },
              });
              console.log("가입 버튼");
              console.log(res);
              if (res.data.success) {
                // info로 보내려면 미리 로그인 토큰들을 갖고 있어야하니까, 회원가입 시키면 로그인도 시켜야함

                const res2 = await axios({
                  method: "post",
                  url: `${SERVER_API_URL}/auth/sign-in`,
                  data: {
                    email: 이메일,
                    password: 비밀번호,
                  },
                });

                console.log(res2);
                console.log(res2.data.message);
                const tokenData = res2.data.data.tokenDto;
                dispatch(
                  userLogin({
                    accessToken: tokenData.accessToken,
                    refreshToken: tokenData.refreshToken,
                  })
                );
                navigate("/info");
              } else {
                set가입실패(res.data.message);
              }
            } catch (err) {
              console.log(err);
              set가입실패(err.response.data.message);
            }
          } else {
            set가입실패("비밀번호 확인이 일치하지 않습니다.");
          }
        } else {
          set가입실패("비밀번호 형식이 잘못되었습니다.");
        }
      } else {
        set가입실패("메일 인증을 확인해주세요.");
      }
    } else {
      set가입실패("메일 인증을 완료해주세요.");
    }
    set가입실패창(true);
    setTimeout(() => {
      set가입실패창(false);
      set가입실패("");
    }, 2000);

    // navigate("/info");
    // 임시
  };

  function 비번체크(password) {
    const 비번조건 = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*]).{8,16}$/;
    return 비번조건.test(password);
  }

  const 비밀번호입력 = (e) => {
    const new비밀번호 = e.target.value;
    set비밀번호(new비밀번호);

    console.log(new비밀번호);
    const 비번체크결과 = 비번체크(e.target.value);
    set비번양식확인(비번체크결과);
  };

  const 비밀번호확인입력 = (e) => {
    const new비밀번호확인 = e.target.value;
    set비밀번호확인(new비밀번호확인);

    console.log(new비밀번호확인);
    set일치여부확인(e.target.value === 비밀번호 ? true : false);
  };

  return (
    <Container maxWidth="xs" component="main" sx={{ height: "100%" }}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <div className="회원가입박스">회원가입</div>

        <Grid container justifyContent={"center"} alignItems={"center"}>
          <Grid
            container
            item
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{
              pb: 4,
            }}
            className="아이디입력컨테이너"
          >
            <Grid
              item
              container
              justifyContent={"center"}
              alignItems={"center"}
              xs={8}
            >
              <TextField
                fullWidth
                variant="outlined"
                color="primary"
                type="text"
                label="아이디(이메일)"
                value={이메일}
                onChange={(e) => set이메일(e.target.value)}
                InputProps={{
                  sx: { borderRadius: "10px" },
                }}
              />
            </Grid>
            <Grid
              item
              container
              justifyContent={"center"}
              alignItems={"center"}
              xs={3}
            >
              <Button
                variant="contained"
                disabled={!이메일}
                sx={{
                  color: "white",
                  textShadow: "2px 2px 20px #8b8b8b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                }}
                onClick={이메일전송버튼}
              >
                메일 인증
              </Button>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid
              item
              container
              justifyContent={"center"}
              alignItems={"center"}
              xs={8}
            >
              <TextField
                disabled={!이메일전송 || 이메일인증}
                fullWidth
                variant="outlined"
                color="primary"
                type="text"
                label="인증번호"
                value={이메일인증번호}
                onChange={(e) => set이메일인증번호(e.target.value)}
                sx={{
                  backgroundColor: !이메일전송 ? "#e7e7e7" : "white",
                  borderRadius: "10px",
                }}
                InputProps={{
                  sx: { borderRadius: "10px" },
                }}
              />
            </Grid>
            <Grid
              item
              container
              xs={3}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  textShadow: "2px 2px 20px #8b8b8b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                }}
                onClick={이메일인증확인버튼}
                disabled={!이메일전송 || 이메일인증}
              >
                {이메일인증 ? "인증 완료" : "인증 확인"}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid container justifyContent={"center"} alignItems={"center"}>
          <Grid
            item
            container
            justifyContent={"flex-end"}
            alignItems={"center"}
            xs={12}
          >
            <Typography color="text.secondary" sx={{ fontSize: "0.8rem" }}>
              8~16자(영문, 숫자, 특수문자 모두 포함)
            </Typography>
          </Grid>
          <Grid
            item
            container
            justifyContent={"center"}
            alignItems={"center"}
            xs={12}
            sx={{ mb: 2 }}
          >
            <TextField
              variant="outlined"
              color="primary"
              fullWidth
              label="비밀번호"
              onChange={비밀번호입력}
              value={비밀번호}
              type="password"
              error={!!비밀번호 && !비번양식확인}
              helperText={
                !!비밀번호 &&
                (!비번양식확인 ? "비밀번호가 양식이 맞지 않습니다!" : "")
              }
              InputProps={{
                sx: { borderRadius: "10px" },
              }}
            />
          </Grid>

          <Grid
            item
            container
            justifyContent={"center"}
            alignItems={"center"}
            xs={12}
            sx={{ mb: 2 }}
          >
            <TextField
              variant="outlined"
              color="primary"
              fullWidth
              label="비밀번호 확인"
              onChange={비밀번호확인입력}
              value={비밀번호확인}
              type="password"
              error={!!비밀번호확인 && !일치여부확인}
              helperText={
                !!비밀번호확인 &&
                !일치여부확인 &&
                "비밀번호가 일치하지 않습니다"
              }
              disabled={!비밀번호 ? true : false}
              sx={{
                backgroundColor: !비밀번호 ? "#e7e7e7" : "white",
                borderRadius: "10px",
              }}
              InputProps={{
                sx: { borderRadius: "10px" },
              }}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent={"center"} alignItems={"center"}>
          <Button
            onClick={가입버튼}
            variant="contained"
            className="가입버튼"
            fullWidth
            sx={{ color: "white", fontSize: "1.5rem", borderRadius: "10px" }}
          >
            가입
          </Button>
        </Grid>
      </Box>
      <Modal
        open={이메일모달버튼}
        aria-labelledby="email-send-modal"
        sx={{ zIndex: 1000 }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "80%",
            maxWidth: "700px",
            bgcolor: "background.paper",
            // border: "2px solid #000",
            boxShadow: 24,
            p: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <Typography
            id="community-input"
            variant="h6"
            sx={{ paddingY: "1vh" }}
          >
            입력하신 메일 주소로
            <br />
            인증번호를 보냈습니다.
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={이메일인증모달}
        aria-labelledby="email-check-modal"
        sx={{ zIndex: 1000 }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "80%",
            maxWidth: "700px",
            bgcolor: "background.paper",
            // border: "2px solid #000",
            boxShadow: 24,
            p: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <Typography
            id="community-input"
            variant="h6"
            sx={{ paddingY: "1vh" }}
          >
            인증 확인되었습니다.
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={가입실패창}
        aria-labelledby="failed-signup-modal"
        sx={{ zIndex: 1000 }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "80%",
            maxWidth: "700px",
            bgcolor: "background.paper",
            // border: "2px solid #000",
            boxShadow: 24,
            p: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <Typography
            id="community-input"
            variant="h6"
            sx={{ paddingY: "1vh" }}
          >
            {가입실패}
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};

export default Signup;