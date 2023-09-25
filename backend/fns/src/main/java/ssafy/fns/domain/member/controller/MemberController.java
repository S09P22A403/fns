package ssafy.fns.domain.member.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.fns.domain.auth.service.dto.TokenDto;
import ssafy.fns.domain.member.controller.dto.EmailDuplicationRequestDto;
import ssafy.fns.domain.member.controller.dto.MemberProfileRequestDto;
import ssafy.fns.domain.member.controller.dto.SignUpRequestDto;
import ssafy.fns.domain.member.entity.Member;
import ssafy.fns.domain.member.service.MemberService;
import ssafy.fns.global.response.JsonResponse;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/api/members")
@Slf4j
public class MemberController {

    private final MemberService memberService;


    @PostMapping(value = "/sign-up")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequestDto requestDto) {
        memberService.signUp(requestDto);
        return JsonResponse.ok("회원가입 성공!");
    }


    @PostMapping(value = "/profile")
    public ResponseEntity<?> saveProfile(@AuthenticationPrincipal Member member,
            @RequestBody MemberProfileRequestDto requestDto) {

        memberService.saveProfile(member, requestDto);
        return JsonResponse.ok("프로필 등록 성공!");
    }

    @PostMapping(value = "/check-nickname-duplicate")
    public ResponseEntity<?> checkNicknameDuplicated(
            @RequestBody EmailDuplicationRequestDto requestDto) {
        memberService.checkNicknameDuplicated(requestDto);
        return JsonResponse.ok("사용가능한 닉네임 입니다");
    }

    @DeleteMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal Member member,
            @RequestBody TokenDto tokenDto) {

        memberService.logout(member, tokenDto);
        return JsonResponse.ok("로그아웃이 완료되었습니다.");
    }

    @DeleteMapping
    public ResponseEntity<?> deleteMember(@AuthenticationPrincipal Member member,
            @RequestBody TokenDto tokenDto) {
        memberService.deleteMember(member, tokenDto);
        return JsonResponse.ok("회원 탈퇴가 완료되었습니다.");
    }
}
