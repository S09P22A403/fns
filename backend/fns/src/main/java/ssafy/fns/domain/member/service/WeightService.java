package ssafy.fns.domain.member.service;

import ssafy.fns.domain.member.controller.dto.TargetWeightRequestDto;
import ssafy.fns.domain.member.controller.dto.WeightRequestDto;
import ssafy.fns.domain.member.entity.Member;
import ssafy.fns.domain.member.service.dto.TargetWeightResponseDto;

public interface WeightService {

    void saveWeight(Member member, WeightRequestDto requestDto);

    //List<Weight> selectAllWeight(Member member, String date);

    void saveTargetWeight(Member member, TargetWeightRequestDto requestDto);

    TargetWeightResponseDto selectTargetWeight(Member member);
}